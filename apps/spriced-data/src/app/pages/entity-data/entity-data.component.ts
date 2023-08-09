import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
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
  GenericControl,
  IValidator,
  QueryColumns,
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
import { Subscription, of } from "rxjs";
import * as moment from "moment";
import { SettingsService } from "../../components/settingsPopUp/service/settings.service";
import { RouterModule } from "@angular/router";

import { AuditDataComponent } from "./audit-data/audit-data.component";
import { LookupPopupComponent } from "../../components/lookup-Popup/lookup-popup.component";
import { EntityGridService } from "./entity-grid.service";

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
  ],
  viewProviders: [MatExpansionPanel],
  providers: [
    EntityGridService,
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
export class EntityDataComponent implements OnDestroy {
  limit: number = 8;
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
  //Dynamic Form
  appForm!: AppForm;
  currentCriteria!: Criteria;

  query?: any;

  @ViewChild(DataGridComponent)
  dataGrid!: DataGridComponent;
  constructor(
    private snackbarService: SnackBarService,
    private dialogService: DialogService,
    private dynamicFormService: DynamicFormService,
    private entityDataService: EntityDataService,
    private entityService: EntityService,
    private dialog: MatDialog,
    private settings: SettingsService,
    private entityGridService: EntityGridService
  ) {
    this.setFormData("", []);
    this.subscribeToFormEvents();
  }

  subscribeToFormEvents() {
    this.subscriptions.push(
      this.dynamicFormService.eventSubject$.subscribe((value) => {
        if (value.type == "lookup") {
          //this.entityService.load(value)
          this.loadLookupPopup(value.data);
        }
      })
    );
  }

  loadLookupPopup(data: any) {
    //this.entityService.load(value)
    const dialogReference = this.dialogService.openDialog(
      LookupPopupComponent,
      {
        data: data,
      }
    );
    dialogReference.afterClosed().subscribe(() => {});
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((item) => item.unsubscribe());
  }

  onPaginate(e: Paginate) {
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
      return { direction: sort.dir.toUpperCase(), property: sort.prop };
    });
    const criteria: Criteria = { ...this.currentCriteria, sorters: sorters };
    this.loadEntityData(this.currentSelectedEntity as Entity, criteria);
  }

  onItemSelected(e: any) {
    this.selectedItem = e;
    this.dynamicFormService.parentForm?.setValue(this.selectedItem);
  }

  onClear() {
    this.selectedItem = null;
    this.dataGrid.clearSelection();
    this.dynamicFormService.parentForm?.reset();
  }

  onDelete() {
    const dialog = this.dialogService.openConfirmDialoge({
      message: "Do you want to delete the record?",
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
        this.currentCriteria.filters = val;
        this.loadEntityData(
          this.currentSelectedEntity as Entity,
          this.currentCriteria
        );
      }
    });
  }

  onEdit() {}

  onUpload() {
    const dialogResult = this.dialog.open(UploadDialogeComponent, {});

    dialogResult.afterClosed().subscribe((val) => {
      if (val) {
        console.log(val.data);
        const fileDetails = {
          source: "web",
          entityName: this.currentSelectedEntity?.name,
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
    const dialogResult = this.dialog.open(StatusComponent, {});

    dialogResult.afterClosed().subscribe((val) => {
      console.log(val);
    });
  }

  onSettings() {
    const dialogResult = this.dialog.open(SettingsPopUpComponent, {
      data: this.currentSelectedEntity,
    });
    dialogResult.afterClosed().subscribe((val) => {
      if (val !== "Cancel") {
        this.loadEntityData(
          this.currentSelectedEntity as Entity,
          this.currentCriteria
        );
      }
    });
  }

  showAddPopup() {
    this.dialogService.openDialog(AddModelComponent, {
      data: this.appForm,
    });
  }
  onModelSelectionChange() {
    this.currentSelectedEntity = undefined;
    // this.headers = [{ name: "", column: "" }];
    this.dataGrid.table._internalColumns = [...[]];
    this.rows = [...[]];
    this.setFormData("", []);
  }

  onAudit() {
    this.dialogService.openDialog(AuditDataComponent, {
      data: this.currentSelectedEntity,
    });
  }

  onEntitySelectionChange(entity: Entity | string) {
    this.currentSelectedEntity = undefined;
    this.dataGrid.table._internalColumns = [...[]];
    this.currentSelectedEntity = entity === "" ? undefined : (entity as Entity);
    this.createDynamicGrid(this.currentSelectedEntity);
    this.createDynamicUIMapping(this.currentSelectedEntity);
  }

  onSubmitEntityData(data: any) {
    if (data.valid) {
      const entityId = this.currentSelectedEntity?.id as number;
      //const finalData = this.removeNull(data.value);
      const finalData = data.value;
      if (!this.selectedItem) {
        this.createEntityData(entityId, finalData);
      } else {
        this.editEntityData(entityId, this.selectedItem.id, finalData);
      }
    } else {
      this.snackbarService.warn("Invalid record data.");
    }
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

  private createDynamicUIMapping(entity: Entity | undefined) {
    let formFields: FormFieldControls = [];
    if (entity) {
      console.log(entity.attributes);
      entity.attributes
        .filter((item) => {
          return (
            (item.permission !== "DENY" && item.editable === true) ||
            item.constraintType == "PRIMARY_KEY"
          );
        })
        .forEach((attr: Attribute) => {
          formFields.push(this.getType(attr));
        });
    }
    this.setFormData("", formFields);
  }

  private getType(attr: Attribute): GenericControl {
    if (attr.type === "LOOKUP") {
      return {
        type: "lookup-select",
        name: attr.name,
        label: attr.displayName || attr.name,
        readOnly: attr.permission === "VIEW" ? true : false,
        displayProp: "name",
        valueProp: "code",
        eventValue: attr.referencedTableId,
        eventType: "lookup",
        placeholder: {
          value: "",
          displayText: "--Select--",
        },
        data: {
          api: {
            onLoad: true,
            isFixed: true,
            method: "loadLookupData",
            params: [attr.referencedTableId],
            provider: FORM_DATA_SERVICE,
          },
        },
        validations: [
          {
            name: "required",
            message: `${
              attr.displayName || attr.name
            } is required.`.toLowerCase(),
            validator: Validators.required,
          },
        ],
      };
    } else {
      switch (attr.dataType) {
        case "STRING_VAR":
        case "TEXT":
        case "LINK":
          return {
            type: "input",
            subType: "text",
            name: attr.name,
            placeholder: attr.displayName || attr.name,
            label: attr.displayName || attr.name,
            validations: this.getValidations(attr),
            readOnly: attr.permission === "VIEW" ? true : false,
          };
        case "INTEGER":
        case "DECIMAL":
          return {
            type: "numeric",
            subType: "text",
            name: attr.name,
            placeholder: attr.displayName || attr.name,
            label: attr.displayName || attr.name,
            decimalCount: attr.numberOfDecimalValues,
            validations: this.getValidations(attr),
            readOnly: attr.permission === "VIEW" ? true : false,
          };

        case "TIME_STAMP":
          return {
            name: attr.name,
            type: "date",
            format: attr.formatter ?? "MM/DD/YYYY",
            label: "MM/DD/YYYY",
            placeholder: attr.displayName || attr.name,
            startDate: moment(new Date()).format("YYYY-MM-DD"),
            startView: "month",
            hiddenDefault: null,
            validations: this.getValidations(attr),
            readOnly: attr.permission === "VIEW" ? true : false,
          };
        case "BOOLEAN":
          return {
            type: "checkbox",
            name: attr.name,
            label: attr.displayName || attr.name,
            validations: this.getValidations(attr),
            readOnly: attr.permission === "VIEW" ? true : false,
            value: false,
          };
        case "AUTO":
        default:
          return {
            type: "input",
            subType: "hidden",
            name: attr.name,
            label: "",
          };
      }
    }
  }

  private getValidations(attr: Attribute): IValidator[] {
    let validations: IValidator[] = [];

    if (!attr.nullable) {
      validations.push({
        name: `required`,
        message: `${attr.displayName || attr.name} is required.`.toLowerCase(),
        validator: Validators.required,
      });
    }

    if (
      attr.size &&
      (attr.dataType === "LINK" ||
        attr.dataType === "STRING_VAR" ||
        attr.dataType === "TEXT")
    ) {
      validations.push({
        name: `maxlength`,
        message: `Maximum length is ${attr.size}.`.toLowerCase(),
        validator: Validators.maxLength,
      });
    }

    if (attr.dataType === "LINK") {
      validations.push({
        name: `${attr.name}_pattern`,
        message: `Invalid pattern for link`.toLowerCase(),
        validator: Validators.pattern(
          "(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?"
        ),
      });
    }
    return validations;
  }

  private createDynamicGrid(entity: Entity | undefined) {
    if (entity) {
      this.headers = this.entityGridService.getGridHeaders(entity);
      this.loadEntityData(entity, {
        pager: { pageNumber: 0, pageSize: this.limit },
      });
    }
  }

  private loadEntityData(entity: Entity, criteria: Criteria) {
    this.currentCriteria = criteria;
    if (entity) {
      this.applyEntitySettings(entity);
      this.subscriptions.push(
        this.entityDataService.loadEntityData(entity.id, criteria).subscribe({
          next: (page) => {
            this.rows = page.content;
            this.totalElements = page.totalElements;
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
      this.headers.forEach((item, index) => {
        item.pinned = undefined;
        if (index === entitySettings.freeze) {
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
        this.dynamicFormService.parentForm?.reset();
        this.snackbarService.success("Record created successfully.");
        this.loadEntityData(
          this.currentSelectedEntity as Entity,
          this.currentCriteria
        );
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
        this.onClear();
        this.snackbarService.success("Record updated successfully.");
        this.loadEntityData(
          this.currentSelectedEntity as Entity,
          this.currentCriteria
        );
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
