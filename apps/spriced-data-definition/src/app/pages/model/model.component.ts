import {
  Component,
  NgModule,
  OnDestroy,
  OnInit,
  ViewChild,
} from "@angular/core";
import { CommonModule } from "@angular/common";
import {
  DataGridComponent,
  DialogService,
  DialogueModule,
  //FilterComponent,
  Header,
  HeaderActionComponent,
  OneColComponent,
  Paginate,
  SnackBarService,
  SnackbarModule,
} from "@spriced-frontend/spriced-ui-lib";
import { ColumnMode, SelectionType, SortType } from "@swimlane/ngx-datatable";
import { ModelAddComponent } from "./components/model-add/model-add.component";
import { MatDialog, MatDialogModule } from "@angular/material/dialog";
import { ModelService } from "../../services/model.service";
import { Subscription } from "rxjs";
import { DatePipe } from "@angular/common";
import * as moment from "moment";

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
    DatePipe,
  ],
  providers: [ModelService],
  templateUrl: "./model.component.html",
  styleUrls: ["./model.component.scss"],
  //changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ModelComponent implements OnInit, OnDestroy {
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
      pipe: (data: any) => {
        return moment(data).format("MM-DD-YYYY");
      },
    },
  ];
  columnMode: ColumnMode = ColumnMode.flex;
  selectionType: SelectionType = SelectionType.single;
  sortType = SortType.single;
  isFullScreen = false;
  totalElements = 10000;
  rows: any[] = [];
  selectedItem: any = null;
  subscriptions: Subscription[] = [];

  @ViewChild(DataGridComponent)
  dataGrid!: DataGridComponent;
  pageNo = 0;
  pageSize = 10;

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
    });
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((item) => {
      item.unsubscribe();
    });
  }

  onAdd() {
    this.dataGrid.clearSelection();
    const dialogRef = this.dialog.open(ModelAddComponent, {
      data: { action: "Add" },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.load(this.pageNo, this.pageSize);
      }
    });
  }

  onRefresh() {
    this.load(this.pageNo, this.pageSize);
  }

  onEdit() {
    const dialogRef = this.dialog.open(ModelAddComponent, {
      data: { action: "Edit", value: this.selectedItem },
    });
    dialogRef.afterClosed().subscribe(() => {
      this.load(this.pageNo, this.pageSize);
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
  }

  onFilter() {
    //const dialogRef = this.dialogService.openDialog(FilterComponent);
  }
}
