import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
} from "@angular/core";
import { CommonModule } from "@angular/common";
import {
  AppForm,
  DataGridComponent,
  DialogueModule,
  DynamicFormModule,
  DynamicFormService,
  DialogService,
  SnackBarService,
  SnackbarModule,
  FORM_DATA_SERVICE,
  FormFieldControls,
  Header,
  HeaderActionComponent,
  Paginate,
  TwoColThreeForthComponent,
  HeaderComponentWrapperComponent,
  GridConstants,
} from "@spriced-frontend/spriced-ui-lib";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { ColumnMode, SelectionType, SortType } from "@swimlane/ngx-datatable";
import { EntitySelectComponent } from "../../components/entity-select/entity-select.component";
import { AddModelComponent } from "./add-model/add-model.component";
import { MatDialog } from "@angular/material/dialog";
import { UploadDialogeComponent } from "../../components/upload-dialoge/upload-dialoge.component";
import { SettingsPopUpComponent } from "../../components/settingsPopUp/settings-pop-up.component";
import { StatusComponent } from "../../components/status/status.component";
import {
  MatExpansionModule,
  MatExpansionPanel,
} from "@angular/material/expansion";
import {
  Attribute,
  Criteria,
  Entity,
  EntityService,
} from "@spriced-frontend/spriced-common-lib";
import { Validators } from "@angular/forms";
import { EntityDataService } from "../../services/entity-data.service";
import {
  Observable,
  Subject,
  Subscription,
  filter,
  first,
  forkJoin,
  map,
  of,
  timer,
} from "rxjs";
import * as moment from "moment";
import { SettingsService } from "../../components/settingsPopUp/service/settings.service";
import { Router, RouterModule } from "@angular/router";

import { AuditDataComponent } from "./audit-data/audit-data.component";
import { LookupPopupComponent } from "../../components/lookup-Popup/lookup-popup.component";
import { EntityGridService } from "./entity-grid.service";
import { EntityFormService } from "./entity-form.service";
import {
  AppDataService,
  ErrorTypes,
} from "@spriced-frontend/shared/spriced-shared-lib";
import { ToolTipRendererDirective } from "libs/spriced-ui-lib/src/lib/components/directive/tool-tip-renderer.directive";
import { CustomToolTipComponent } from "libs/spriced-ui-lib/src/lib/components/custom-tool-tip/custom-tool-tip.component";

const TIMER_CONST = 300;
@Component({
  selector: "sp-entity-data",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.Default,
  imports: [
    CommonModule,
    DialogueModule,
    DynamicFormModule,
    DataGridComponent,
    HeaderActionComponent,
    MatButtonModule,
    MatIconModule,
    TwoColThreeForthComponent,
    SnackbarModule,
    EntitySelectComponent,
    MatExpansionModule,
    RouterModule,
    LookupPopupComponent,
    HeaderComponentWrapperComponent,
    CustomToolTipComponent,
    ToolTipRendererDirective,
  ],
  viewProviders: [MatExpansionPanel],
  providers: [
    EntityGridService,
    EntityFormService,
    EntityDataService,
    SettingsService,
    {
      provide: FORM_DATA_SERVICE,
      useExisting: EntityDataService,
    },
    DynamicFormService,
  ],
  templateUrl: "./entity-data.component.html",
  styleUrls: ["./entity-data.component.scss"],
})
export class EntityDataComponent implements OnDestroy, OnInit {
  hide = false;
  limit: number = GridConstants.LIMIT;
  subscriptions: Subscription[] = [];
  isFullScreen = false;
  headers: Header[] = [];
  columnMode: ColumnMode = ColumnMode.force;
  selectionType: SelectionType = SelectionType.single;
  sortType = SortType.single;
  selectedItem: any;
  totalElements = 0;
  rows: any[] = [];
  currentSelectedEntity?: Entity;
  disableSubmit: boolean = false;
  //Dynamic Form
  appForm!: AppForm;
  currentCriteria!: Criteria;
  globalSettings!: any;
  query?: any;
  lastId = -1;
  entityDataLoadCompleted$ = new Subject();

  @ViewChild(DataGridComponent)
  dataGrid!: DataGridComponent;
  pageNumber: number = 0;
  relatedEntity: any;
  ValidationMessage: any = [];
  public showTooltip: boolean = false;

  defaultCodeSetting = "namecode";

  constructor(
    private snackbarService: SnackBarService,
    private dialogService: DialogService,
    private dynamicFormService: DynamicFormService,
    private entityDataService: EntityDataService,
    private dialog: MatDialog,
    private settings: SettingsService,
    private entityGridService: EntityGridService,
    private entityFormService: EntityFormService,
    private router: Router,
    private statusPannelService: AppDataService
  ) {
    this.globalSettings = this.settings.getGlobalSettings();
    this.setFormData("", []);
    this.subscribeToFormEvents();
  }
  ngOnInit(): void {
    this.subscribeToEntityDataLoadEvents();
  }

  subscribeToEntityDataLoadEvents() {
    this.subscriptions.push(
      this.entityDataLoadCompleted$.subscribe((page: any) => {
        this.rows = page.content;
        if (this.rows.length === 0) {
          this.onClear();
        }
        this.totalElements = page.totalElements;
        const selectionTimer = timer(TIMER_CONST);
        if (this.rows && this.rows?.length > 0) {
          //Since the form not completely get loaded by the time data arrived.
          selectionTimer.pipe(first()).subscribe(() => {
            this.setSelectedRow(this.rows[0]);
          });
        }
      })
    );
  }

  subscribeToFormEvents() {
    this.subscriptions.push(
      this.dynamicFormService.eventSubject$.subscribe((value) => {
        if (value.type == "lookup") {
          this.loadLookupPopup(value.data);
        }
      })
    );
  }

  loadLookupPopup(data: any) {
    const pathParams: any = {
      modelId: this.currentSelectedEntity?.groupId,
      entityId: data,
    };
    const pathSegments = Object.keys(pathParams)
      .map((key) => encodeURIComponent(pathParams[key]))
      .join("/");
    const url = `${window.location.href}/${pathSegments}`; // Replace this with the desired URL
    const newTab: any = window.open(url, "_blank");
    newTab.focus();

    // const dialogReference = this.dialogService.openDialog(
    //   LookupPopupComponent,
    //   {
    //     data: data,
    //   }
    // );
    // dialogReference.afterClosed().subscribe(() => { });
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((item) => item.unsubscribe());
  }

  onPaginate(e: Paginate) {
    this.pageNumber = e.offset;
    const criteria: Criteria = {
      ...this.currentCriteria,
      pager: {
        pageNumber: e.offset,
        pageSize: this.limit,
      },
    };
    this.loadEntityData(this.currentSelectedEntity as Entity, criteria);
  }

  onSort(e: any) {
    const sorters = e.sorts.map((sort: any) => {
      const props: string[] = sort.prop.split(",");
      if (props.length > 1) {
        sort.prop = props.find((item) => item.endsWith("_code"));
      }
      return { direction: sort.dir.toUpperCase(), property: sort.prop };
    });

    const criteria: Criteria = { ...this.currentCriteria, sorters: sorters };
    this.loadEntityData(this.currentSelectedEntity as Entity, criteria, true);
  }

  onItemSelected(e: any) {
    this.setSelectedRow(e);
  }
  onClear() {
    this.selectedItem = null;
    this.dataGrid.clearSelection();
    this.dataGrid.selected = [];
    this.dynamicFormService.resetFormValues();
    this.dynamicFormService.setReadOnly(
      this.entityFormService.getReadOnlyFormControlNames(
        this.currentSelectedEntity
      )
    );
  }

  onReset() {
    const extractedFormFields = this.entityFormService.extractFormFieldsOnly(
      this.selectedItem,
      this.dynamicFormService.getFormValues()
    );
    this.dynamicFormService.setFormValues(null, extractedFormFields);
  }
  onDelete() {
    const dialog = this.dialogService.openConfirmDialoge({
      message: "Do you want to delete?",
      title: "Delete",
      icon: "delete",
    });

    dialog.afterClosed().subscribe((result) => {
      if (result) {
        this.deleteEntityData(this.selectedItem.id);
      }
    });
  }

  onFullScreen() {
    this.isFullScreen = !this.isFullScreen;
    this.hide = true;
    // Temp Fix for rendering the grid
    setTimeout(() => {
      this.hide = false;
    }, 100);
  }

  onFilter() {
    this.addDisplayNameInFilter();
    const dialogResult = this.dialogService.openFilterDialog({
      persistValueOnFieldChange: true,
      columns: this.entityGridService.getFilterColumns(this.headers),
      emptyMessage: "Please select filter criteria.",
      displayFormat: this.globalSettings.displayFormat,
      config: null,
      query: this.query,
    });

    dialogResult.afterClosed().subscribe((val) => {
      if (val) {
        this.query = dialogResult.componentInstance.data.query;
        this.addDisplayNameInFilter(this.query);
        this.currentCriteria.filters = val;
        this.loadEntityData(
          this.currentSelectedEntity as Entity,
          this.currentCriteria
        );
      }
    });
  }

  /**
   * HANDLE THIS FUNCTION FOR ADD DISPLAY NAME IN FILTER QUERY
   * @param query any
   */
  public addDisplayNameInFilter(query?: any) {
    const updatedHeaders = this.headers.map((item: any) => {
      const res = item.column.split(",");
      if (res.length > 1) {
        item.column = res.find((el: any) => el.endsWith("_code"));
      }
      return { ...item };
    });

    if (!!query && query.rules) {
      query.rules.forEach((el: any) => {
        const item: any = updatedHeaders.find(
          (elm: any) => elm.column === el.field
        );
        if (el?.rules && el?.rules.length > 0) {
          this.addDisplayNameInFilter(el); // Recursively process sub-rules
        }
        if (!!item) {
          el.displayName = item.name;
        }
        return;
      });
    }
  }

  public getToolTipTemplate(conditions: any): string {
    this.showTooltip = !!conditions;
    if (!conditions || conditions.length === 0) {
      return "";
    }
    const text: any = this.getTooltipText(conditions);
    return text;
  }

  public getTooltipText(items: any): string {
    let tooltipText = "";
    if (items.condition && items.rules && items.rules.length > 0) {
      const lastItem = items.rules.length - 1;
      items.rules.forEach((rule: any, index: number) => {
        if (!rule.condition && !rule.rules) {
          const field = rule?.displayName;
          const value = !!rule?.value ? rule?.value : "";
          const condition = lastItem !== index ? items.condition : "";
          tooltipText += `<strong>${field}</strong> ${rule.operator} ${value} <strong>${condition}</strong> <br>`;
        }
        if (!!rule.condition && !!rule.rules) {
          tooltipText += `(`;
          tooltipText += this.getNestedTooltipText(rule);
          tooltipText += "<br>";
        }
      });
    } else if (items.field && items.operator && items.value) {
      tooltipText += `${items.condition} <strong>${items.field}</strong> ${items.operator} ${items.value}`;
    }
    return tooltipText;
  }

  public getNestedTooltipText(items: any): string {
    let tooltipText = "";
    if (items.condition && items.rules && items.rules.length > 0) {
      const lastItem = items.rules.length - 1;
      items.rules.forEach((rule: any, index: number) => {
        if (!rule.condition && !rule.rules) {
          const field = rule?.displayName;
          const value = !!rule?.value ? rule?.value : "";
          const condition = lastItem !== index ? items.condition : "";
          tooltipText += `<strong>${field}</strong> ${rule.operator} ${value} <strong>${condition}</strong>`;
          if (index < items.rules.length - 1) {
            tooltipText += "<br>";
          }
        }
        if (!!rule.condition && !!rule.rules) {
          tooltipText += `(`;
          tooltipText += this.getNestedTooltipText(rule);
        }
      });
    }
    tooltipText += ")";
    return tooltipText;
  }

  onClearFilter() {
    this.query = null;
    this.currentCriteria.filters = [];
    this.loadEntityData(
      this.currentSelectedEntity as Entity,
      this.currentCriteria
    );
  }

  clearCriteria() {
    if (this.currentCriteria) {
      this.currentCriteria.filters = [];
      this.currentCriteria.sorters = [];
      this.currentCriteria.pager = { pageNumber: 0, pageSize: this.limit };
    }
  }

  onEdit() {
    if (this.selectedItem) {
      this.dialogService.openDialog(AddModelComponent, {
        data: {
          appForm: this.appForm,
          entity: this.currentSelectedEntity,
          selectedItem: this.selectedItem,
        },
      });
    }
  }

  onUpload() {
    const dialogResult = this.dialog.open(UploadDialogeComponent, {});

    dialogResult.afterClosed().subscribe((val) => {
      if (val) {
        const fileDetails = {
          source: "web",
          entityName: this.currentSelectedEntity?.name,
          entityId: this.currentSelectedEntity?.id,
        };
        const formData = new FormData();

        formData.append("file", val.data, val.data.name);
        formData.append(
          "fileDetails",
          new Blob([JSON.stringify(fileDetails)], { type: "application/json" })
        );
        // formData.append("fileDetails", JSON.stringify(fileDetails));
        this.entityDataService
          .upload(formData, fileDetails)
          .subscribe((val) => {
            this.snackbarService.success("Uploaded Successfully");
          });
      }
    });
  }
  onStatus() {
    const dialogResult = this.dialog.open(StatusComponent, {
      data: this.currentSelectedEntity,
    });

    dialogResult.afterClosed().subscribe((val) => {});
  }

  onSettings() {
    const dialogResult = this.dialog.open(SettingsPopUpComponent, {
      data: this.currentSelectedEntity,
    });

    dialogResult.afterClosed().subscribe((val) => {
      if (val === "ok") {
        this.globalSettings = this.settings.getGlobalSettings();
        this.createDynamicGrid(
          this.currentSelectedEntity as Entity,
          this.currentCriteria,
          this.globalSettings
        );

        this.createDynamicUIMapping(this.currentSelectedEntity);
      }
    });
  }

  showAddPopup() {
    this.dialogService.openDialog(AddModelComponent, {
      data: {
        appForm: this.appForm,
        entity: this.currentSelectedEntity,
        selectedItem: this.selectedItem,
      },
    });
  }
  onModelSelectionChange() {
    this.currentSelectedEntity = undefined;
    // this.headers = [{ name: "", column: "" }];
    this.dataGrid.table._internalColumns = [...[]];
    this.rows = [...[]];
    this.setFormData("", []);
    this.clearCriteria();
  }

  onAudit() {
    this.dialogService.openDialog(AuditDataComponent, {
      data: {
        currentSelectedEntity: this.currentSelectedEntity,
        selectedItem: this.selectedItem,
      },
    });
  }

  onEntitySelectionChange(entity: Entity | string) {
    this.selectedItem = null;
    this.pageNumber = 0;
    this.currentSelectedEntity = undefined;
    this.dataGrid.table._internalColumns = [...[]];
    this.currentSelectedEntity = entity === "" ? undefined : (entity as Entity);
    this.clearCriteria();
    this.createDynamicGrid(
      this.currentSelectedEntity,
      {
        pager: { pageNumber: 0, pageSize: this.limit },
      },
      this.settings.getGlobalSettings()
    );
    this.createDynamicUIMapping(entity as Entity);
    this.loadRelatedEntity();
  }
  loadRelatedEntity() {
    this.subscriptions.push(
      this.entityDataService
        .getRelatedEntity(
          this.currentSelectedEntity?.groupId,
          this.currentSelectedEntity?.id
        )
        .subscribe((val) => {
          this.relatedEntity = val;
          this.query = null;
        })
    );
  }
  onSubmitEntityData(data: any) {
    if (this.headers.length < 1) {
      this.snackbarService.warn("Please check whether user has permission.");
    } else {
      if (data.valid) {
        const entityId = this.currentSelectedEntity?.id as number;
        //const finalData = this.removeNull(data.value);
        const finalData = {
          ...data.value,
          ...Object.fromEntries(this.dynamicFormService.getExtraData()),
        };
        if (!this.selectedItem) {
          this.createEntityData(entityId, finalData);
        } else {
          this.editEntityData(entityId, this.selectedItem.id, finalData);
        }
      } else {
        this.snackbarService.warn("Invalid record data.");
      }
    }
  }

  onExport(format: "csv" | "xlsx" | "pdf") {
    // this.dataGrid.export(
    //   format,
    //   this.currentSelectedEntity?.displayName as string
    // );
    this.entityDataService.exportToExcel(
      this.currentSelectedEntity?.id as number,
      `${this.currentSelectedEntity?.displayName}.xlsx`,
      this.globalSettings?.displayFormat || this.defaultCodeSetting,
      this.currentCriteria
    );
  }

  // private getFilterColumns(): QueryColumns[] {
  //   return this.headers
  //     .filter((item) => item.isFilterable)
  //     .map((col: any) => {
  //       return {
  //         name: col.column,
  //         displayName: col.name,
  //         dataType: col.dataType || "string",
  //         options: col.dataType === "category" ? col.options : undefined,
  //       };
  //     });
  // }

  private deleteEntityData(entityDataId: number) {
    return this.entityDataService
      .deleteEntityData((this.currentSelectedEntity as Entity).id, entityDataId)
      .subscribe({
        next: (result) => {
          if (result > 0) {
            this.snackbarService.success("Record deleted successfully.");
            this.onClear();
            this.loadEntityData(
              this.currentSelectedEntity as Entity,
              this.currentCriteria
            );
          }
        },
        error: (err) => {
          this.snackbarService.error("Record deletion failed.");
        },
      });
  }

  private setSelectedRow(row: any) {
    this.selectedItem = row;
    //this.dynamicFormService.parentForm?.setValue(this.selectedItem);
    const extractedFormFields = this.entityFormService.extractFormFieldsOnly(
      this.selectedItem,
      this.dynamicFormService.getFormValues()
    );

    const extraData = this.entityFormService.extractExtraData(
      this.selectedItem,
      this.currentSelectedEntity as Entity
    );

    this.dynamicFormService.setFormValues(extraData, extractedFormFields);
    if (row["permission"] === "READ") {
      this.dynamicFormService.setReadOnly();
    } else {
      this.dynamicFormService.setReadOnly(
        this.entityFormService.getReadOnlyFormControlNames(
          this.currentSelectedEntity
        )
      );
    }
  }

  private createDynamicUIMapping(entity: Entity | undefined) {
    let formFields: FormFieldControls = [];
    if (entity) {
      formFields = this.entityFormService.getFormFieldControls(
        entity,
        this.globalSettings?.displayFormat || this.defaultCodeSetting
      );
      this.disableSubmit = !entity.attributes.reduce((prev, current) => {
        return prev || current.permission === "UPDATE";
      }, false);
    }
    this.setFormData("", formFields);
  }

  public patchFormData(formFields: any): Observable<any[]> {
    const observables: Observable<any>[] = [];
    let lookupContrl = formFields.filter(
      (elm: any) => elm.eventType === "lookup"
    );
    const uniqueEventValues: any[] = [];
    // Remove duplicate eventValue items
    lookupContrl = lookupContrl.filter((item: any) => {
      const isDuplicate = uniqueEventValues.indexOf(item.eventValue) !== -1;
      if (!isDuplicate) {
        uniqueEventValues.push(item.eventValue);
      }
      return !isDuplicate;
    });

    for (const item of lookupContrl) {
      if (item.eventType === "lookup") {
        // Make API call if not cached
        const observable = this.entityDataService
          .loadEntity(item.eventValue)
          .pipe(
            map((elm: any) => {
              return elm;
            })
          );
        observables.push(observable);
      }
    }
    // Use forkJoin to wait for all observables to complete and then return the updated formFields array
    return forkJoin(observables).pipe(
      map((elm) => elm) // Return the updated formFields after all observables complete
    );
  }

  private createDynamicGrid(
    entity: Entity | undefined,
    criteria: Criteria,
    globalSettings: any
  ) {
    if (entity) {
      const showSystemAttributes = globalSettings
        ? globalSettings.showSystem
        : false;
      this.headers = [
        {
          column: "",
          name: "",
          canAutoResize: false,
          isSortable: false,
          width: 80,
          tooltip: true,
          tooltipTemplate: (row: any) => this.getErrorTooltip(row),
          imgsrc: (row: any) => this.getImage(row),
          showtooltip: (row: any) => !row.is_valid,
          className: "grid-image-icon",
        },
      ];
      let headers: Header[] = this.entityGridService.getGridHeaders(
        entity,
        showSystemAttributes,
        globalSettings?.displayFormat || this.defaultCodeSetting
      );
      this.headers.push(...headers);
      this.loadEntityData(entity, criteria);
    }
  }
  getErrorTooltip(row: any) {
    // this.entityDataService.loadValidationMessage(item) .subscribe((val) => {
    // console.log(val)
    // });
    // this.ValidationMessage=[
    //   {
    //       "rule": "rule 1",
    //       "message": " rule failed   "
    //   },
    //   {
    //       "rule": "rule 2",
    //       "message": " rule passed   "
    //   }
    //  ]
    return this.ValidationMessage;
  }
  getImage(row: any) {
    return row.is_valid
      ? "assets/images/valid.png"
      : "assets/images/invalid.png";
  }
  private loadEntityData(
    entity: Entity,
    criteria: Criteria,
    columnSort?: boolean
  ) {
    if (!columnSort) {
      const sort: any = { direction: "DESC", property: "updated_date" };
      criteria.sorters = [sort];
    }

    //criteria = this.setDefaultCriteria(criteria, this.lastId);
    this.currentCriteria = criteria;
    if (entity) {
      this.applyEntitySettings(entity);
      this.subscriptions.push(
        this.entityDataService
          .loadEntityData(entity.id, criteria)
          .pipe(first())
          .subscribe({
            next: (page) => {
              this.lastId =
                page.content && page.content.length
                  ? page.content[page.content.length - 1].id
                  : -1;
              this.entityDataLoadCompleted$.next(page);
            },
            error: (err) => {
              this.rows = [];
              console.error(err);
            },
          })
      );
    } else {
      this.rows = [];
    }
  }

  private setDefaultCriteria(criteria: Criteria, lastId: number): Criteria {
    let id =
      criteria &&
      criteria.pager &&
      criteria.pager.pageSize * this.limit > lastId
        ? criteria.pager.pageSize * criteria.pager.pageNumber
        : lastId;
    const filters: any = [
      {
        filterType: "CONDITION",
        joinType: "NONE",
        operatorType: "GREATER_THAN",
        key: "id",
        value: id,
        dataType: "number",
      },
    ];
    if (
      (!criteria.sorters && !criteria.filters) ||
      (criteria.sorters?.length == 0 && criteria.filters?.length == 0) ||
      (criteria.sorters?.length == 0 &&
        criteria.filters?.length == 1 &&
        criteria.filters[0].key == "id")
    ) {
      criteria.filters = filters;
    }
    return criteria;
  }

  private applyEntitySettings(entity: Entity) {
    const entitySettings = this.settings.getCurrentSettings(entity.name);
    if (entitySettings) {
      this.limit = entitySettings.noOfRecords;
      this.currentCriteria.pager = {
        pageNumber: this.pageNumber,
        pageSize: this.limit,
      };
      this.headers.forEach((item, index) => {
        item.pinned = undefined;
        if (index < entitySettings.freeze) {
          item.pinned = "left";
        }
      });
    }
  }

  // private removeNull(data: any) {
  //   let finalData: any = {};
  //   for (let item in data) {
  //     if (data[item] !== null && data[item] !== undefined) {
  //       finalData[item] = data[item];
  //     }
  //   }
  //   return finalData;
  // }

  private createEntityData(entityId: number, data: any) {
    this.entityDataService.createEntityData(entityId, data).subscribe({
      next: (item) => {
        // Validation rule failure
        const isBusinessRuleSuccess = item.result[0].is_valid;
        if (!isBusinessRuleSuccess) {
          let errorMessage = "";
          item.ruleValidations.forEach((rulVal: any) => {
            rulVal.ruleResults.forEach((rulResult: any) => {
              errorMessage += rulResult.message;
            });
          });
          this.snackbarService.error(errorMessage);
          this.statusPannelService.setErrors([
            {
              type: ErrorTypes.ERROR,
              msg: errorMessage,
            },
          ]);
        } else {
          this.dynamicFormService.resetFormValues();
          this.snackbarService.success("Record created successfully.");
          this.loadEntityData(
            this.currentSelectedEntity as Entity,
            this.currentCriteria
          );
        }
      },
      error: (err) => {
        console.error(err);
        let errMessage = "";
        if (err.error.errorCode === "DB_UK-008") {
          errMessage = `Unique constraint violation-${err.error.details}`;
        }
        this.snackbarService.error(`Record creation failed.${errMessage}`);
      },
    });
  }

  private editEntityData(entityId: number, recordId: number, data: any) {
    data.id = recordId;
    this.entityDataService.updateEntityData(entityId, data).subscribe({
      next: (item) => {
        const isBusinessRuleSuccess = item.result[0].is_valid;
        if (!isBusinessRuleSuccess) {
          let errorMessage = "";
          item.ruleValidations.forEach((rulVal: any) => {
            rulVal.ruleResults.forEach((rulResult: any) => {
              errorMessage += rulResult.message;
            });
          });
          const sepStart = "{SEP}";
          const sepEnd = "{/SEP}";

          let firstMessage = "";
          const startIndex = errorMessage.indexOf(sepStart);
          const endIndex = errorMessage.indexOf(sepEnd);

          if (startIndex !== -1 && endIndex !== -1 && startIndex < endIndex) {
            firstMessage = errorMessage
              .substring(startIndex + sepStart.length, endIndex)
              .trim();
            errorMessage = firstMessage
              .replace(/:\s/g, ":\n")
              .replace(/\b(IF|THEN|ELSE)\b\s/g, "\n$1 ");
            this.snackbarService.error(errorMessage);
          } else {
            this.snackbarService.error(errorMessage);
          }
          this.statusPannelService.setErrors([
            {
              type: ErrorTypes.ERROR,
              msg: errorMessage,
            },
          ]);
        } else {
          this.onClear();
          this.snackbarService.success("Record updated successfully.");
          this.loadEntityData(
            this.currentSelectedEntity as Entity,
            this.currentCriteria
          );
        }
      },
      error: (err) => {
        console.error(err);
        this.snackbarService.error("Record update failed.");
      },
    });
  }

  private setFormData(title: string, formFieldControls: FormFieldControls) {
    this.appForm = {
      title: title,
      groups: [
        {
          title: "",
          formFieldControls: [...formFieldControls],
        },
      ],
      validations: [],
      asyncValidations: [],
    };
  }
  onRefresh() {
    this.onEntitySelectionChange(this.currentSelectedEntity as Entity);
  }
}
