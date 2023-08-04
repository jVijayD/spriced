import { Component, ViewChild } from "@angular/core";
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
} from "@spriced-frontend/spriced-ui-lib";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { ColumnMode, SelectionType, SortType } from "@swimlane/ngx-datatable";
import { EntitySelectComponent } from "../../components/entity-select/entity-select.component";
import { AddModelComponent } from "./add-model/add-model.component";

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
export class EntityDataComponent {
  entityName = "List";
  isFullScreen = false;
  headers: Header[] = [];
  columnMode: ColumnMode = ColumnMode.force;
  selectionType: SelectionType = SelectionType.single;
  sortType = SortType.single;
  selectedItem: any;
  //totalElements = 10000;
  rows: any[] = [];
  data: any[] = [];

  //Dynamic Form
  private formFields!: FormFieldControls;
  appForm: AppForm = {
    title: "",
    groups: [
      {
        title: "",
        formFieldControls: [],
      },
    ],
    asyncValidations: [],
    validations: [],
  };

  @ViewChild(DataGridComponent)
  dataGrid!: DataGridComponent;
  constructor(
    private snackbarService: SnackBarService,
    private dialogService: DialogService,
    private dynamicFormService: DynamicFormService
  ) {}
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
  onUpload() {}
  showAddPopup() {
    this.dialogService.openDialog(AddModelComponent, {
      data: this.appForm,
    });
  }
}
