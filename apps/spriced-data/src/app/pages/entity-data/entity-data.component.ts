import { Component, OnDestroy, ViewChild } from "@angular/core";
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
import { Attribute, Entity } from "@spriced-frontend/spriced-common-lib";
import { ValidationErrors, Validators } from "@angular/forms";
import { EntityDataService } from "../../services/entity-data.service";
import { Subscription } from "rxjs";
import * as moment from "moment";

@Component({
  selector: "sp-entity-data",
  standalone: true,
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
  ],
  providers: [
    EntityDataService,
    {
      provide: FORM_DATA_SERVICE,
      useValue: {
        //   getMembers: () => {
        //     return of([10, 20, 30, 40, 50]);
        //   },
        //   getCountries: () => {
        //     return of([
        //       {
        //         name: "England",
        //         id: 4,
        //         countryCode: "+95",
        //       },
        //     ]);
        //   },
      },
    },
    DynamicFormService,
  ],
  templateUrl: "./entity-data.component.html",
  styleUrls: ["./entity-data.component.scss"],
})
export class EntityDataComponent implements OnDestroy {
  subscriptions: Subscription[] = [];
  isFullScreen = false;
  headers: Header[] = [];
  columnMode: ColumnMode = ColumnMode.force;
  selectionType: SelectionType = SelectionType.single;
  sortType = SortType.single;
  selectedItem: any;
  //totalElements = 10000;
  rows: any[] = [];
  //data: any[] = [];

  currentSelectedEntity?: Entity;
  //Dynamic Form
  //private formFields!: FormFieldControls;
  appForm!: AppForm;

  @ViewChild(DataGridComponent)
  dataGrid!: DataGridComponent;
  constructor(
    private snackbarService: SnackBarService,
    private dialogService: DialogService,
    private dynamicFormService: DynamicFormService,
    private entityDataService: EntityDataService,
    private dialog: MatDialog
  ) {
    this.setFormData("", []);
  }
  ngOnDestroy(): void {
    this.subscriptions.forEach((item) => item.unsubscribe());
  }

  onPaginate(e: Paginate) {}
  onItemSelected(e: any) {
    this.selectedItem = e;
  }
  onClear() {
    this.selectedItem = null;
    this.dataGrid.clearSelection();
  }
  onSort(e: any) {}
  onDelete() {}
  onRefresh() {}
  onFullScreen() {
    this.isFullScreen = !this.isFullScreen;
  }
  onFilter() {}
  onEdit() {}

  onUpload() {
    const dialogResult = this.dialog.open(UploadDialogeComponent, {});

    dialogResult.afterClosed().subscribe((val) => {
      console.log(val);
    });
  }
  onStatus() {
    const dialogResult = this.dialog.open(StatusComponent, {});

    dialogResult.afterClosed().subscribe((val) => {
      console.log(val);
    });
  }

  onSettings() {
    const dialogResult = this.dialog.open(SettingsPopUpComponent, {});
    dialogResult.afterClosed().subscribe((val) => {
      console.log(val);
    });
  }

  showAddPopup() {
    this.dialogService.openDialog(AddModelComponent, {
      data: this.appForm,
    });
  }

  onEntitySelectionChange(entity: Entity | string) {
    this.currentSelectedEntity = entity === "" ? undefined : (entity as Entity);
    this.createDynamicGrid(this.currentSelectedEntity);
    this.createDynamicUIMapping(this.currentSelectedEntity);
  }

  private createDynamicUIMapping(entity: Entity | undefined) {
    let formFields: FormFieldControls = [];
    if (entity) {
      entity.attributes.forEach((attr: Attribute) => {
        formFields.push(this.getType(attr));
      });
    }
    this.setFormData("", formFields);
  }

  private getType(attr: Attribute): GenericControl {
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
        };
      case "INTEGER":
        return {
          type: "numeric",
          subType: "text",
          name: attr.name,
          placeholder: attr.displayName || attr.name,
          label: attr.displayName || attr.name,
          decimalCount: attr.numberOfDecimalValues,
          validations: this.getValidations(attr),
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
        };
      case "BOOLEAN":
        return {
          type: "checkbox",
          name: attr.name,
          label: attr.displayName || attr.name,
          validations: this.getValidations(attr),
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
      this.headers = entity.attributes.map((attr: Attribute) => {
        return {
          column: attr.name,
          name: attr.displayName || attr.name,
          canAutoResize: true,
          isSortable: true,
          isFilterable: true,
        };
      });
      this.loadEntityData(entity);
    } else {
      this.headers = [];
    }
  }

  private loadEntityData(entity: Entity) {
    if (entity) {
      this.subscriptions.push(
        this.entityDataService.loadEntityData(entity.id).subscribe({
          next: (items) => {
            alert("GET DATA");
          },
          error: (err) => {
            this.rows = [];
            alert("Error");
          },
        })
      );
    } else {
    }
  }

  onSubmitEntityData(data: any) {
    if (data.valid) {
      const entityId = this.currentSelectedEntity?.id as number;
      const finalData = this.removeNull(data.value);
      if (!this.selectedItem) {
        this.createEntityData(entityId, finalData);
      } else {
        this.editEntityData(entityId, this.selectedItem.id, finalData);
      }
    } else {
      this.snackbarService.warn("Invalid record data.");
    }
  }

  private removeNull(data: any) {
    let finalData: any = {};
    for (let item in data) {
      if (data[item] !== null && data[item] !== undefined) {
        finalData[item] = data[item];
      }
    }
    return finalData;
  }

  private createEntityData(entityId: number, data: any) {
    this.entityDataService.createEntityData(entityId, data).subscribe({
      next: (item) => {
        this.snackbarService.success("Record created successfully.");
      },
      error: (err) => {
        console.error(err);
        this.snackbarService.error("Record creation failed.");
      },
    });
  }

  private editEntityData(entityId: number, recordId: number, data: any) {
    data.id = recordId;
    this.entityDataService.updateEntityData(entityId, data).subscribe({
      next: (item) => {
        this.snackbarService.success("Record updated successfully.");
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
