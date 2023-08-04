import { Component, NgModule, OnInit, ViewChild } from "@angular/core";
import { CommonModule } from "@angular/common";
import {
  DataGridComponent,
  DialogService,
  DialogueModule,
  FilterData,
  //FilterComponent,
  Header,
  HeaderActionComponent,
  OneColComponent,
  Paginate,
  QueryColumns,
  SnackBarService,
  SnackbarModule,
} from "@spriced-frontend/spriced-ui-lib";
import { ColumnMode, SelectionType, SortType } from "@swimlane/ngx-datatable";
import { ModelAddComponent } from "./components/model-add/model-add.component";
import { MatDialog, MatDialogModule } from "@angular/material/dialog";
import { ModelService } from "../../services/model.service";

@Component({
  selector: "sp-defnition-entity",
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
  ],
  providers: [ModelService],
  templateUrl: "./model.component.html",
  styleUrls: ["./model.component.scss"],
  //changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ModelComponent implements OnInit {
  headers: Header[] = [
    { column: "id", name: "Id", canAutoResize: true, isSortable: true },
    { column: "name", name: "Name", canAutoResize: true, isSortable: true },
    {
      column: "displayName",
      name: "Display Name",
      canAutoResize: true,
      isSortable: true,
    },
    {
      column: "updatedBy",
      name: "Updated By",
      canAutoResize: true,
      isSortable: true,
    },
    {
      column: "updatedDate",
      name: "Updated Date",
      canAutoResize: true,
      isSortable: true,
    },
  ];
  columnMode: ColumnMode = ColumnMode.flex;
  selectionType: SelectionType = SelectionType.single;
  sortType = SortType.single;
  isFullScreen = false;
  totalElements = 10000;
  rows: any[] = [];
  selectedItem: any = null;
  filterData: any;
  @ViewChild(DataGridComponent)
  dataGrid!: DataGridComponent;
  pageNo = 0;
  pageSize = 10;
  temp: any = [];

  constructor(
    private dialogService: DialogService,
    private snackbarService: SnackBarService,
    private dialog: MatDialog,
    private modelService: ModelService
  ) {}
  ngOnInit(): void {
    this.load(this.pageNo, this.pageSize);
  }
  load(pageNo: number, pageSize: number) {
    this.modelService.loadAllModels().subscribe((results: any) => {
      this.rows = results;
      this.totalElements = results.length;
      this.filterData = results;
    });
  }
  onAdd() {
    this.dataGrid.clearSelection();
    const dialogRef = this.dialog.open(ModelAddComponent, {
      data: { action: "Add" },
      //maxWidth: "300px",
      //maxHeight: "400px",
    });
    dialogRef.componentInstance.dataChange.subscribe((result: any) => {
      this.rows.push(result);
      this.rows = [...this.rows];
    });
  }

  onRefresh() {
    this.load(this.pageNo, this.pageSize);
  }

  onEdit() {
    const dialogRef = this.dialog.open(ModelAddComponent, {
      data: { action: "Edit", value: this.selectedItem },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result == true) {
        this.load(this.pageNo, this.pageSize);
      }
    });
  }
  onDelete() {
    const dialogRef = this.dialogService.openConfirmDialoge({
      message: "Do you want to delete?",
      title: "Delete Model",
      icon: "delete",
    });
    dialogRef.afterClosed().subscribe((result: any) => {
      if (result == true) {
        this.modelService
          .delete(this.selectedItem.id)
          .subscribe((results: any) => {
            this.snackbarService.success("Succesfully Deleted");
            this.load(this.pageNo, this.pageSize);
          });
      }
    });
    // this.selectedItem = null;
    // this.dataGrid.clearSelection();
  }
  onPaginate(e: Paginate) {
    this.pageNo = e.offset;
    this.pageSize = e.pageSize;
    // this.load(this.pageNo,this.pageSize);
  }

  onItemSelected(e: any) {
    this.selectedItem = e;
  }

  onSort(e: any) {
    console.log(e);
  }

  onClear() {
    this.dataGrid.clearSelection();
    this.selectedItem = null;
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
      //query: query,
      //config: config,
      config: null,
      columns: columns,
    };

    const dialogResult = this.dialogService.openFilterDialog(data);
    dialogResult.afterClosed().subscribe((val) => {
      if (val !== null) {
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
