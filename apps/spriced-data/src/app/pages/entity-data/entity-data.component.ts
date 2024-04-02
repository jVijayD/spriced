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
  TwoColThreeForthExpandableComponent,
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
  GlobalSettingService,
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

import { AuditDataComponent } from "@spriced-frontend/spriced-ui-lib";
import { LookupPopupComponent } from "../../components/lookup-Popup/lookup-popup.component";
import { EntityGridService } from "./entity-grid.service";
import { EntityFormService } from "./entity-form.service";
import {
  AppDataService,
  ErrorTypes,
  MfeAppPubSubService,
} from "@spriced-frontend/shared/spriced-shared-lib";
import { ToolTipRendererDirective } from "libs/spriced-ui-lib/src/lib/components/directive/tool-tip-renderer.directive";
import { CustomToolTipComponent } from "libs/spriced-ui-lib/src/lib/components/custom-tool-tip/custom-tool-tip.component";
import { SavedFilterlistComponent } from "../../components/filter-list/saved-filterlist/saved-filterlist.component";
import { AddFilterlistComponent } from "../../components/filter-list/add-filterlist/add-filterlist.component";
import { EntityExportDataService } from "../../services/entity-export.service";
import { DownloadsDialogueComponent } from "../../components/downloads-dialogue/downloads-dialogue.component";
import { FilterListService } from "../../components/filter-list/services/filter-list.service";

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
    TwoColThreeForthExpandableComponent,
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
  globalSettings: any = {
    settingsData: {
      displayFormat: "namecode",
      showsystem: false,
    },
    type: "global",
  };
  query?: any;
  lastId = 0;
  entityDataLoadCompleted$ = new Subject();

  @ViewChild(DataGridComponent)
  dataGrid!: DataGridComponent;
  pageNumber: number = 0;
  relatedEntity: any;
  ValidationMessage: any = [];
  public showTooltip: boolean = false;

  defaultCodeSetting = "namecode";
  edit = false;
  savedFilter: any;
  selectedColumns: any = [];
  columns: any;
  freeze: number=0;

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
    private statusPannelService: AppDataService,
    private entityExportService: EntityExportDataService,
    private pubService: MfeAppPubSubService,
    private filterListService: FilterListService,
    private globalSetting: GlobalSettingService
  ) {
    this.globalSettings=this.getSettingsData() 
    this.setFormData("", []);
    this.subscribeToFormEvents();
  }

  getSettingsData()
  {
    this.settings.getGlobalSettings().subscribe((results:any)=>
     {
      if(results?.settingsData)
      {
       return results
      }
      else
      {
        return {settingsData:{displayFormat:"namecode",showSytem:false},type:'global'}
      }
     })
  }
  ngOnInit(): void {
    this.subscribeToEntityDataLoadEvents();
    this.pubService.subscribe("download-background", (data) => {
      if ((data as any).detail === "download-background") {
        this.dialog.open(DownloadsDialogueComponent, {});
      }
    });
  }

  subscribeToEntityDataLoadEvents() {
    this.subscriptions.push(
      this.entityDataLoadCompleted$.subscribe((page: any) => {
        this.rows = page.content;
        if (this.rows.length === 0) {
          this.onClear();
        }
        this.rows = this.rows.map((elm: any) => ({ ...elm, comment: "" }));
        this.totalElements = page.totalElements;
        const selectionTimer = timer(TIMER_CONST);
        this.dataGrid.table._offsetX.next(0);
        if (this.rows && this.rows?.length > 0) {
          //Since the form not completely get loaded by the time data arrived.
          selectionTimer.pipe(first()).subscribe(() => {
            this.setSelectedRow(this.rows[0]);
          });
        }
      })
    );
  }

  updateGridRow(row: any) {
    let selRowIndex = -1;
    const selectionTimer = timer(TIMER_CONST);
    if (this.rows && this.rows.length > 0) {
      selRowIndex = this.rows.findIndex((item) => item.id === row.id);
    }
    if (selRowIndex != -1) {
      this.rows[selRowIndex] = row;
      //this.rows = [...this.rows];
      selectionTimer.pipe(first()).subscribe(() => {
        this.rows = this.rows.map((elm: any) => ({ ...elm, comment: "" }));
        this.setSelectedRow(this.rows[selRowIndex]);
      });
    }
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
    localStorage.removeItem('explorerStorage');
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
    this.dynamicFormService.resetFormValues();
    this.loadEntityData(this.currentSelectedEntity as Entity, criteria);
  }

  onSort(e: any) {
    const sorters = e.sorts.map((sort: any) => {
      const props: string[] = sort.prop.split(",");
      let prop: any = props.length === 1 ? props[0] : [];
      if (props.length > 1) {
        prop = props.find((item) => item.endsWith("_code"));
      }
      return { direction: sort.dir.toUpperCase(), property: prop };
    });
    this.dataGrid.table._offset = this.pageNumber;
    const criteria: Criteria = { ...this.currentCriteria, sorters: sorters };
    this.loadEntityData(this.currentSelectedEntity as Entity, criteria);
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
    const headers = this.addDisplayNameInFilter();
    const dialogResult = this.dialogService.openFilterDialog({
      persistValueOnFieldChange: true,
      columns: this.entityGridService.getFilterColumns(headers),
      emptyMessage: "Please select filter criteria.",
      displayFormat: this.globalSettings?.settingsData?.displayFormat || 'namecode',
      config: null,
      query: JSON.parse(JSON.stringify(this.query)),
      save: true,
      edit: this.edit,
      filterName: this.savedFilter?.name,
    });

    dialogResult.afterClosed().subscribe((val) => {
      if (val) {
        if (val.button && val.button == "save") {
          const dialogRef = this.dialog.open(AddFilterlistComponent, {
            data: {
              item: {
                filterQuery: dialogResult.componentInstance.data.query,
                entityId: this.currentSelectedEntity?.id,
                groupId: this.currentSelectedEntity?.groupId,
                name: "",
                description: "",
              },
              action: "Add",
            },
          });
        } else if (val.button && val.button == "saveExisting") {
          this.savedFilter.filterQuery =
            dialogResult.componentInstance.data.query;
          this.filterListService.editFilter(this.savedFilter).subscribe({
            next: (result) => {
              this.snackbarService.success("Filter Updated successfully.");
            },
          });
        } else {
          this.query = dialogResult.componentInstance.data.query;
          this.addDisplayNameInFilter(this.query);
          this.currentCriteria.filters = val;
          this.pageNumber = 0;
          this.currentCriteria.pager = {
            pageNumber: this.pageNumber,
            pageSize: this.limit,
          };
          this.loadEntityData(
            this.currentSelectedEntity as Entity,
            this.currentCriteria
          );
        }
      }
    });
  }
  onSavedFilter() {
    const dialogResult = this.dialogService.openDialog(
      SavedFilterlistComponent,
      {
        data: { entityId: this.currentSelectedEntity?.id },
      }
    );
    dialogResult.afterClosed().subscribe((val) => {
      if (val) {
        this.edit = val.edit;
        this.savedFilter = val.data;
        this.query = val.data.filterQuery;
        this.addDisplayNameInFilter(this.query);
        this.currentCriteria.filters = val.filter;
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
    const updatedHeaders = this.columns.map((item: any) => {
      const res = item.column.split(",");
      if (res.length > 1) {
        const col = res.find((el: any) => el.endsWith("_code"));
        if (!!col) {
          return { ...item, column: col };
        }
      }
      return { ...item };
    });

    const validationStatus: any = {
      dataType: "boolean",
      name: "Validation Status",
      formType: "FREE_FORM",
      column: "is_valid",
      options: undefined,
      isFilterable: true,
      referencedTableId: null,
    };
    updatedHeaders.push(validationStatus);

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
        if (el.field === "is_valid") {
          el.displayName = "Validation Status";
        }
        return;
      });
    }
    return updatedHeaders;
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
        let item = items.rules[index + 1];
        if (!rule.condition && !rule.rules) {
          const field = rule?.displayName;
          const value = !!rule?.value ? rule?.value : "";
          const condition =
            lastItem !== index && !item?.rules
              ? items.condition
              : !!item && item?.rules
              ? item.condition
              : "";
          tooltipText += `<strong>${field}</strong> ${rule.operator} ${value} <strong>${condition}</strong> <br>`;
        }
        if (!!rule.condition && !!rule.rules) {
          const conditionType = !!item ? items.condition : "";
          tooltipText += `(`;
          tooltipText += this.getNestedTooltipText(rule, conditionType);
          tooltipText += "<br>";
        }
      });
    } else if (items.field && items.operator && items.value) {
      tooltipText += `${items.condition} <strong>${items.field}</strong> ${items.operator} ${items.value}`;
    }
    return tooltipText;
  }

  public getNestedTooltipText(items: any, parentItem: any): string {
    let tooltipText = "";
    let type = "";
    if (items.condition && items.rules && items.rules.length > 0) {
      const lastItem = items.rules.length - 1;
      items.rules.forEach((rule: any, index: number) => {
        let item = items.rules[index + 1];
        if (!rule.condition && !rule.rules) {
          type = lastItem === index ? parentItem : "";
          const field = rule?.displayName;
          const value = !!rule?.value ? rule?.value : "";
          const condition =
            lastItem !== index && !item?.rules
              ? items.condition
              : !!item && item?.rules
              ? item.condition
              : "";
          tooltipText += `<strong>${field}</strong> ${rule.operator} ${value} <strong>${condition}</strong>`;
          if (index < items.rules.length - 1) {
            tooltipText += "<br>";
          }
        }
        if (!!rule.condition && !!rule.rules) {
          const conditionType = !!item ? items.condition : "";
          tooltipText += `(`;
          tooltipText += this.getNestedTooltipText(rule, conditionType);
        }
      });
    }
    tooltipText += `) <strong>${type}</strong> `;
    return tooltipText;
  }

  onClearFilter() {
    this.query = null;
    this.edit = false;
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
    this.totalElements = 0;
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
      data: { entity: this.currentSelectedEntity, header: this.columns,global:this.globalSettings },
    });

    dialogResult.afterClosed().subscribe((val) => {
      if (val.event == "ok") {
        this.globalSettings =val.global
        this.selectedColumns=val.current.settingsData.columns || [];
        this.limit =val.current.settingsData.noOfRecords;
        this.freeze=val.current.settingsData.freeze;
        this.currentCriteria.pager = {
          pageNumber: this.pageNumber,
          pageSize: this.limit,
        }
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
    this.lastId = 0;
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
    this.selectedColumns=[]
    this.freeze=0
    this.limit=GridConstants.LIMIT
    this.settings
      .getCurrentSettings(entity)
      .subscribe((entitySettings: any) => {
        if (entitySettings?.settingsData) {
          this.selectedColumns = entitySettings.settingsData.columns || [];
          this.limit = entitySettings.settingsData.noOfRecords;
          this.freeze = entitySettings.settingsData.freeze;
        }
        this.createDynamicGrid(
          this.currentSelectedEntity,
          {
            pager: { pageNumber: 0, pageSize: this.limit },
          },
          this.globalSettings?.settingsData
        );
        this.createDynamicUIMapping(entity as Entity);
      });
    const currentStorage = {modelId: this.currentSelectedEntity?.groupId, entityId: this.currentSelectedEntity?.id};
    this.globalSetting.setCurrentStorage('explorerStorage', currentStorage);
    this.lastId = 0;
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
    let limit = process.env["NX_DOWNLOAD_LIMIT"] as unknown as number;
    let limitAsync = 20000;
    if (this.totalElements > limit) {
      this.dialogService.openInfoDialog({
        message:
          "You are about to download " +
          this.totalElements +
          " records.Download limit is " +
          limit +
          ". Please filter the records before download ",
        title: "Download limit exceeded",
        icon: "cloud_download",
      });
    } else {
      const dialog = this.dialogService.openConfirmDialoge({
        message: "Do you want to download " + this.totalElements + " records ?",
        title: "Download",
        icon: "cloud_download",
      });
      dialog.afterClosed().subscribe(async (result) => {
        if (result) {
          await this.entityExportService.export(
            this.currentSelectedEntity?.id as number,
            this.currentSelectedEntity?.name as string,
            `${this.currentSelectedEntity?.displayName}.xlsx`,
            this.globalSettings?.settingsData?.displayFormat || this.defaultCodeSetting,
            this.currentCriteria,
            this.totalElements > limitAsync,
            this.selectedColumns
          );
        }
      });
    }
  }

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
      this.dynamicFormService.getFormRowValues()
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
        this.globalSettings?.settingsData?.displayFormat || this.defaultCodeSetting
      );
      if (this.selectedColumns && this.selectedColumns?.length !== 0 && this.selectedColumns!=null) {
        formFields = this.entityFormService.setSelectedFields(
          this.selectedColumns,
          formFields
        );
      }
      console.log(formFields)
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
        ? globalSettings?.settingsData?.showSystem
        : false;
      this.headers = [
        {
          column: "validation_status",
          name: "",
          canAutoResize: false,
          isSortable: false,
          width: 80,
          tooltip: true,
          tooltipTemplate: (row: any) => this.getErrorTooltip(row),
          imgsrc: (row: any) => this.getImage(row),
          showtooltip: (row: any) =>
            !row.is_valid && this.ValidationMessage.length !== 0,
          className: "grid-image-icon",
        },
      ];
      let headers: Header[] = this.entityGridService.getGridHeaders(
        entity,
        showSystemAttributes,
        globalSettings?.settingsData?.displayFormat || this.defaultCodeSetting
      );
      this.headers.push(...headers);
      this.columns = this.headers;
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

  private loadEntityData(entity: Entity, criteria: Criteria) {
    this.currentCriteria = criteria;
    const enrichedCriteria = this.setDefaultCriteria(criteria, this.lastId);
    if (entity) {
      this.applyEntitySettings(entity);
      this.subscriptions.push(
        this.entityDataService
          .loadEntityDataFilter(
            entity.id,
            enrichedCriteria,
          )
          .pipe(first())
          .subscribe({
            next: (page) => {
              this.lastId =
                page.content && page.content.length
                  ? page.content[page.content.length - 1].id
                  : 0;
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
    if (!criteria.sorters || criteria.sorters.length == 0) {
      const sort: any = { direction: "DESC", property: "id" };
      criteria.sorters = [sort];
    }

    // if (
    //   criteria.sorters.length === 1 &&
    //   criteria.sorters[0].direction === "DESC" &&
    //   criteria.sorters[0].property === "id" &&
    //   lastId &&
    //   lastId != 0
    // ) {
    //   const filter: any = {
    //     filterType: "CONDITION",
    //     joinType: "NONE",
    //     operatorType: "LESS_THAN",
    //     key: "id",
    //     value: lastId,
    //     dataType: "number",
    //   };

    //   if (
    //     !criteria.filters ||
    //     criteria.filters.length === 0 ||
    //     (criteria.filters.length === 1 && criteria.filters[0].key === "id")
    //   ) {
    //     criteria.filters = [filter];
    //   }
    // }

    return criteria;
  }

  private applyEntitySettings(entity: Entity) {
      if (this.selectedColumns && this.selectedColumns?.length !== 0) {
        this.headers = this.entityGridService.setSelectedColumns(
          this.selectedColumns,
          this.columns
        );
      }
      this.headers.forEach((item, index) => {
        item.pinned = undefined;
        if (index < this.freeze) {
          item.pinned = "left";
        }
      });
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
          this.resetToPageZero();
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

  private resetToPageZero() {
    //Reset to page number 0;
    this.pageNumber = 0;
    if (this.currentCriteria && this.currentCriteria.pager) {
      this.currentCriteria.pager.pageNumber = 0;
    }
  }

  private editEntityData(entityId: number, recordId: number, data: any) {
    data.id = recordId;
    this.entityDataService.updateEntityData(entityId, data).subscribe({
      next: (item) => {
        const isBusinessRuleSuccess = item.result[0].is_valid;
        if (!isBusinessRuleSuccess) {
          this.showRuleErrorMessage(item);
        } else {
          this.onClear();
          this.snackbarService.success("Record updated successfully.");
          //load only the updated entity
          this.entityDataService
            .loadEntityDataById(
              this.currentSelectedEntity?.id as number,
              item.result[0].id
            )
            .subscribe((item) => {
              this.updateGridRow(item);
            });
        }
      },
      error: (err) => {
        console.error(err);
        this.snackbarService.error("Record update failed.");
      },
    });
  }

  private showRuleErrorMessage(item: any) {
    let errorMessage = "";
    item.ruleValidations.forEach((rulVal: any) => {
      rulVal.ruleResults.forEach((rulResult: any) => {
        if (!rulResult.success) {
          errorMessage = rulResult.message;
        }
      });
    });

    this.snackbarService.error(errorMessage);
    this.statusPannelService.setErrors([
      {
        type: ErrorTypes.ERROR,
        msg: errorMessage,
      },
    ]);
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
    //this.onEntitySelectionChange(this.currentSelectedEntity as Entity);
    this.loadEntityData(
      this.currentSelectedEntity as Entity,
      this.currentCriteria
    );
  }
}
