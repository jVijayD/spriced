import {
  ChangeDetectorRef,
  Component,
  Input,
  ViewChild,
} from "@angular/core";
import { CommonModule } from "@angular/common";
import {
  AppForm,
  DataGridComponent,
  SnackbarModule,
  Header,
  HeaderComponentWrapperComponent,
  GridConstants,
  ThreeColComponent,
  SnackBarService,
  DialogService,
  DynamicFormService,
  Paginate,
  FormFieldControls,
  HeaderActionComponent,
  FORM_DATA_SERVICE,
  DynamicFormModule,
  SetttingPopupComponent,
} from "@spriced-frontend/spriced-ui-lib";
import { ColumnMode, SelectionType, SortType } from "@swimlane/ngx-datatable";
import {
  MatExpansionModule, MatExpansionPanel,
} from "@angular/material/expansion";
import {
  Criteria,
  DataEntityService,
  Entity,
  EntityService,
  FormEntityService,
  GlobalSettingService,
  GridEntityService,
} from "@spriced-frontend/spriced-common-lib";
import {
  Observable,
  Subject,
  Subscription,
  first,
  forkJoin,
  map,
  timer,
} from "rxjs";
import { HierarchyTreeviewComponent } from "../hierarchy-treeview/hierarchy-treeview.component";
import { MatDialog, MatDialogModule } from "@angular/material/dialog";
import { ActivatedRoute, Router } from "@angular/router";
import { AppDataService, ErrorTypes } from "@spriced-frontend/shared/spriced-shared-lib";
import { MatIconModule } from "@angular/material/icon";
import { CustomToolTipComponent } from "libs/spriced-ui-lib/src/lib/components/custom-tool-tip/custom-tool-tip.component";
import { ToolTipRendererDirective } from "libs/spriced-ui-lib/src/lib/components/directive/tool-tip-renderer.directive";
import { EntitySelectionComponent } from "../entity-selection/entity-selection.component";

const TIMER_CONST = 300;

@Component({
  selector: "sp-derived-hierarchy",
  standalone: true,
  imports: [CommonModule, ThreeColComponent, MatExpansionModule, DataGridComponent, HeaderComponentWrapperComponent, HierarchyTreeviewComponent, SnackbarModule, MatDialogModule, HeaderComponentWrapperComponent, HeaderActionComponent, MatIconModule, CustomToolTipComponent, ToolTipRendererDirective, DynamicFormModule, EntitySelectionComponent],
  viewProviders: [MatExpansionPanel],
  providers: [
    GridEntityService,
    FormEntityService,
    DataEntityService,
    GlobalSettingService,
    {
      provide: FORM_DATA_SERVICE,
      useExisting: DataEntityService,
    },
    DynamicFormService,
    DialogService
  ],
  templateUrl: "./derived-hierarchy.component.html",
  styleUrls: ["./derived-hierarchy.component.scss"],
})
export class DerivedHierarchyComponent {
  @ViewChild(HierarchyTreeviewComponent) public derivedHierarchy!: HierarchyTreeviewComponent;
  isFullScreen = false;
  hide = false;
  hierarchyId: any;
  limit: number = GridConstants.LIMIT;
  subscriptions: Subscription[] = [];
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

  entityDataLoadCompleted$ = new Subject();

  @ViewChild(DataGridComponent)
  dataGrid!: DataGridComponent;
  pageNumber: number = 0;
  relatedEntity: any;
  public showTooltip: boolean = false;
  public entity:any;
  defaultCodeSetting = "namecode";
  hierarchyData: any;


  constructor(
    private snackbarService: SnackBarService,
    private dialogService: DialogService,
    private dynamicFormService: DynamicFormService,
    private entityDataService: DataEntityService,
    private dialog: MatDialog,
    private settings: GlobalSettingService,
    private entityGridService: GridEntityService,
    private entityFormService: FormEntityService,
    private router: Router,
    private aroute: ActivatedRoute,
    private statusPannelService: AppDataService,
    private entityService: EntityService,
  ) {
    this.globalSettings = this.settings.getGlobalSettings();
    this.setFormData("", []);
    this.subscribeToFormEvents();
    this.entityDataService.filterDataByHierarchy.subscribe((res: any) => {
      this.currentCriteria.filters = res ? res : '';
      this.createDynamicUIMapping(this.currentSelectedEntity);
      this.loadEntityData(
        this.currentSelectedEntity as Entity,
        this.currentCriteria
      );
    })
  }
  ngOnInit(): void {
    this.hierarchyId = this.aroute.snapshot.paramMap.get("hierarchyId") ? Number(this.aroute.snapshot.paramMap.get("hierarchyId")) : null;
    if (this.hierarchyId) {
      this.entityDataService.loadHierarchy(this.hierarchyId).subscribe((e: any) => {
        this.hierarchyData = e;
        if (!!this.hierarchyId) {
          this.derivedHierarchy.onBind(e, this.globalSettings?.displayFormat);
        }
      });
    }
    this.subscribeToEntityDataLoadEvents();
  }

  subscribeToEntityDataLoadEvents() {
    this.subscriptions.push(
      this.entityDataLoadCompleted$.subscribe((page: any) => {
        this.rows = page.content;
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
    const dialogResult = this.dialogService.openFilterDialog({
      persistValueOnFieldChange: true,
      columns: this.entityGridService.getFilterColumns(this.headers),
      emptyMessage: "Please select filter criteria.",
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
  public addDisplayNameInFilter(query: any) {
    if (query.rules) {
      query.rules.forEach((el: any) => {
        const item: any = this.headers.find(
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
  // onEdit() {
  //   if (this.selectedItem) {
  //     this.dialogService.openDialog(AddModelComponent, {
  //       data: {
  //         appForm: this.appForm,
  //         entity: this.currentSelectedEntity,
  //         selectedItem: this.selectedItem,
  //       },
  //     });
  //   }
  // }

  // onUpload() {
  //   const dialogResult = this.dialog.open(UploadDialogeComponent, {});

  //   dialogResult.afterClosed().subscribe((val) => {
  //     if (val) {
  //       const fileDetails = {
  //         source: "web",
  //         entityName: this.currentSelectedEntity?.name,
  //       };
  //       const formData = new FormData();

  //       formData.append("file", val.data, val.data.name);
  //       formData.append(
  //         "fileDetails",
  //         new Blob([JSON.stringify(fileDetails)], { type: "application/json" })
  //       );
  //       // formData.append("fileDetails", JSON.stringify(fileDetails));
  //       this.entityDataService
  //         .upload(formData, fileDetails)
  //         .subscribe((val) => {
  //           this.snackbarService.success("Uploaded Successfully");
  //         });
  //     }
  //   });
  // }
  // onStatus() {
  //   const dialogResult = this.dialog.open(StatusComponent, {
  //     data: this.currentSelectedEntity,
  //   });

  //   dialogResult.afterClosed().subscribe((val) => {});
  // }

  onSettings() {
    const dialogResult = this.dialog.open(SetttingPopupComponent, {
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
        this.derivedHierarchy.onBind(this.hierarchyData,this.globalSettings?.displayFormat);
      }
    });
  }

  // showAddPopup() {
  //   this.dialogService.openDialog(AddModelComponent, {
  //     data: {
  //       appForm: this.appForm,
  //       entity: this.currentSelectedEntity,
  //       selectedItem: this.selectedItem,
  //     },
  //   });
  // }
  onModelSelectionChange() {
    this.currentSelectedEntity = undefined;
    // this.headers = [{ name: "", column: "" }];
    this.dataGrid.table._internalColumns = [...[]];
    this.rows = [...[]];
    this.setFormData("", []);
  }
  getEntityName(event:any){
   this.entity = event as Entity;
   this.onEntitySelectionChange(event);
  }

  // onAudit() {
  //   this.dialogService.openDialog(AuditDataComponent, {
  //     data: {
  //       currentSelectedEntity: this.currentSelectedEntity,
  //       selectedItem: this.selectedItem,
  //     },
  //   });
  // }

  onEntitySelectionChange(entity: Entity | any) {
    this.selectedItem = null;
    this.currentCriteria.filters = entity?.filter ? entity?.filter : [];
    this.currentCriteria.pager = { pageNumber: 0, pageSize: this.limit };
    this.currentSelectedEntity = undefined;
    this.dataGrid.table._internalColumns = [...[]];
    this.currentSelectedEntity = entity === "" ? undefined : (entity as Entity);
    this.createDynamicGrid(
      this.currentSelectedEntity,
      this.currentCriteria,
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
      this.headers = this.entityGridService.getGridHeaders(
        entity,
        showSystemAttributes,
        globalSettings?.displayFormat || this.defaultCodeSetting
      );
      this.loadEntityData(entity, criteria);
    }
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
    this.currentCriteria = criteria;
    if (entity) {
      this.applyEntitySettings(entity);
      this.subscriptions.push(
        this.entityDataService
          .loadEntityData(entity.id, criteria)
          .pipe(first())
          .subscribe({
            next: (page) => {
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
          this.snackbarService.error(errorMessage);
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
}
