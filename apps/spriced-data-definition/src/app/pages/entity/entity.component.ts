import { Component, ViewChild } from "@angular/core";
import { CommonModule } from "@angular/common";
import {
  DataGridComponent,
  DialogService,
  DialogueModule,
  FilterData,
  Header,
  HeaderActionComponent,
  OneColComponent,
  Paginate,
  QueryColumns,
  SnackBarService,
  SnackbarModule,
} from "@spriced-frontend/spriced-ui-lib";
import { MatDialog, MatDialogModule } from "@angular/material/dialog";
import { ModelAddComponent } from "../model/components/model-add/model-add.component";
import { ColumnMode, SelectionType, SortType } from "@swimlane/ngx-datatable";
import { EntityService } from "../../services/entity.service";
import { ModelService } from "../../services/model.service";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatSelectModule } from "@angular/material/select";
import { EntityAddComponent } from "./components/entity-add/entity-add.component";
import * as moment from "moment";
@Component({
  selector: "sp-entity",
  standalone: true,
  imports: [
    CommonModule,
    OneColComponent,
    DataGridComponent,
    HeaderActionComponent,
    ModelAddComponent,
    DialogueModule,
    SnackbarModule,
    MatDialogModule,
    ReactiveFormsModule,
    FormsModule,
    MatSelectModule,
  ],
  templateUrl: "./entity.component.html",
  styleUrls: ["./entity.component.scss"],
})
export class EntityComponent {
  headers: Header[] = [
    {
      column: "id",
      name: "Id",
      canAutoResize: true,
      isSortable: true,
      hidden: true,
      width: 100,
    },
    {
      column: "name",
      name: "Name",
      canAutoResize: true,
      isSortable: true,
      width: 100,
    },
    {
      column: "displayName",
      name: "Display Name",
      canAutoResize: true,
      isSortable: true,
      width: 100,
    },
    {
      column: "updatedBy",
      name: "Updated By",
      canAutoResize: true,
      isSortable: true,
      width: 100,
    },
    {
      column: "updatedDate",
      name: "Updated Date",
      canAutoResize: true,
      isSortable: true,
      width: 100,
      pipe: (data: any) => {
        return moment(data).format("MM-DD-YYYY");
      },
    },
  ];
  columnMode: ColumnMode = ColumnMode.force;
  selectionType: SelectionType = SelectionType.single;
  sortType = SortType.single;
  isFullScreen = false;
  totalElements = 10000;
  rows: any[] = [];
  selectedItem: any = null;

  @ViewChild(DataGridComponent)
  dataGrid!: DataGridComponent;
  modelList: any;
  groupId: any;
  temp: any[] = [];
  filterData: any;
  query?: any;
  constructor(
    private dialogService: DialogService,
    private snackbarService: SnackBarService,
    private dialog: MatDialog,
    private entityService: EntityService,
    private modelService: ModelService
  ) {}
  ngOnInit(): void {
    this.modelService.loadAllModels().subscribe((result: any) => {
      this.modelList = result;
      this.groupId = result[0]?.id;
      this.load({ value: this.groupId });
    });
  }
  load(id: any) {
    this.entityService.loadEntityByModel(id.value).subscribe((results: any) => {
      this.rows = results;
      this.totalElements = results.length;
      this.filterData = results;
      this.selectedItem = null;
    });
  }
  onAdd() {
    this.dataGrid.clearSelection();
    this.selectedItem = null;
    const dialogRef = this.dialog.open(EntityAddComponent, {
      data: { action: "Add", entities: this.rows, row: "" },
      //maxWidth: "300px",
      //maxHeight: "400px",
    });
    dialogRef.componentInstance.dataChange.subscribe((result: any) => {
      const entity = {
        name: result.name,
        displayName: result.displayName,
        id: result.id,
        groupId: this.groupId,
        isDisabled: false,
        //enableAuditTrial: false,
        attributes: result.attributes,
        enableAuditTrial: result.enableAuditTrial,
      };
      this.entityService.add(entity).subscribe({
        next: (results: any) => {
          this.rows.push(results);
          this.rows = [...this.rows];
          this.totalElements = this.rows.length;
          this.snackbarService.success("Succesfully Added");
          dialogRef.close();
        },
        error: (err: any) => {
          if (err.error.errorCode == "DB_UK-008") {
            this.snackbarService.error("Entity Already Exists.");
          } else {
            this.snackbarService.error("Entity Creation Failed.");
          }
        },
      });
    });
  }
  onRefresh() {
    this.query = null;
    this.load({ value: this.groupId });
  }
  onClear() {
    this.dataGrid.clearSelection();
    this.selectedItem = null;
  }

  onEdit() {
    const dialogRef = this.dialog.open(EntityAddComponent, {
      data: { action: "Edit", entities: this.rows, row: this.selectedItem },
    });
    dialogRef.componentInstance.dataChange.subscribe((result: any) => {
      console.log(result);
      const entity = {
        name: result.name,
        displayName: result.displayName,
        id: result.id,
        groupId: this.groupId,
        isDisabled: false,
        enableAuditTrial: false,
        attributes: result.attributes,
      };
      this.entityService.edit(entity).subscribe({
        next: (results: any) => {
          this.snackbarService.success("Succesfully Updated");
          dialogRef.close();
          this.load({ value: this.groupId });
        },
        error: (err: any) => {
          this.snackbarService.error("Entity Update Failed.");
        },
      });
    });
  }
  onDelete() {
    const dialogRef = this.dialogService.openConfirmDialoge({
      message: "Do you want to delete?",
      title: "Delete Entity",
      icon: "delete",
    });
    dialogRef.afterClosed().subscribe((result: any) => {
      if (result == true) {
        this.entityService.delete(this.selectedItem.id).subscribe({
          next: (results: any) => {
            this.snackbarService.success("Succesfully Deleted");
            this.load({ value: this.groupId });
            this.dataGrid.clearSelection();
          },
          error: (err: any) => {
            this.snackbarService.error("Entity Deletion Failed.");
          },
        });
      }
    });
  }
  onPaginate(e: Paginate) {
    //this.rows = this.getData(e.limit, e.offset);
  }

  onItemSelected(e: any) {
    console.log(e);
    this.selectedItem = e;
  }

  onSort(e: any) {
    console.log(e);
  }
  onFilter() {
    const columns: QueryColumns[] = [
      {
        name: "id",
        displayName: "Id",
        dataType: "number",
      },
      {
        name: "name",
        displayName: "Name",
        dataType: "string",
      },
      {
        name: "updatedBy",
        displayName: "Updated By",
        dataType: "string",
      },
      {
        name: "updatedDate",
        displayName: "Updated Date",
        dataType: "string",
      },
    ];
    const data: FilterData = {
      query: this.query,
      persistValueOnFieldChange: true,
      emptyMessage: "Please select filter criteria.",
      config: null,
      columns: columns,
    };

    const dialogResult = this.dialogService.openFilterDialog(data);
    dialogResult.afterClosed().subscribe((val) => {
      if (val !== null) {
        this.query = dialogResult.componentInstance.data.query;

        this.temp = [];
        this.rows = this.filterData;
        console.log(val);
        val.map((item: any, index: number) => {
          switch (item.operatorType) {
            case "LESS_THAN": {
              var row = this.filterData.filter(function (el: any) {
                return el[item.key] < item.value;
              });
              this.temp.push(...row);
              this.rows = this.temp;
              break;
            }
            case "EQUALS": {
              var row = this.filterData.filter(function (el: any) {
                return el[item.key] == item.value;
              });

              this.temp.push(...row);
              this.rows = this.temp;
              break;
            }
            case "GREATER_THAN": {
              var row = this.filterData.filter(function (el: any) {
                return el[item.key] > item.value;
              });
              this.temp.push(...row);
              this.rows = this.temp;

              break;
            }
            case "GREATER_THAN_EQUALS": {
              var row = this.filterData.filter(function (el: any) {
                return el[item.key] >= item.value;
              });
              this.temp.push(...row);
              this.rows = this.temp;
              break;
            }
            case "LESS_THAN_EQUALS": {
              var row = this.filterData.filter(function (el: any) {
                return el[item.key] <= item.value;
              });
              this.temp.push(...row);
              this.rows = this.temp;

              break;
            }
            case "IS_NOT_EQUAL": {
              var row = this.filterData.filter(function (el: any) {
                return el[item.key] != item.value;
              });
              this.temp.push(...row);
              this.rows = this.temp;

              break;
            }
            case "LIKE": {
              var row = this.filterData.filter(function (el: any) {
                return el[item.key].includes(item.value);
              });
              this.temp.push(...row);
              this.rows = this.temp;
              break;
            }
            case "ILIKE": {
              var row = this.filterData.filter(function (el: any) {
                return el[item.key].endsWith(item.value);
              });
              this.temp.push(...row);
              this.rows = this.temp;

              break;
            }
            default: {
              break;
            }
          }
        });

        const result: any = [...new Set(this.rows)];
        this.rows = result;
      }
    });
  }
}
