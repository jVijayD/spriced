import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  ViewChild,
} from "@angular/core";
import { CommonModule } from "@angular/common";
import {
  DataGridComponent,
  DialogService,
  DialogueModule,
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
    { column: "id", name: "id" },
    { column: "name", name: "name" },
    { column: "displayName", name: "displayName" },
    { column: "updatedBy", name: "updatedBy" },
    { column: "updatedDate", name: "updatedDate" },
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

  constructor(
    private dialogService: DialogService,
    private snackbarService: SnackBarService,
    private dialog: MatDialog,
    private modelService: ModelService
  ) {}
  ngOnInit(): void {
    this.load();
  }
  load() {
    console.log("load");
    this.modelService.loadAllModels().subscribe((results: any) => {
      this.rows = results;
    });
  }
  onAdd() {
    this.dataGrid.clearSelection();
    const dialogRef = this.dialog.open(ModelAddComponent, {
      data: { action: "Add" },
      //maxWidth: "300px",
      //maxHeight: "400px",
    });
    dialogRef.afterClosed().subscribe(() => {
      this.load();
    });
  }

  onRefresh() {}

  onEdit() {
    const dialogRef = this.dialog.open(ModelAddComponent, {
      data: { action: "Edit", value: this.selectedItem },
    });
    dialogRef.afterClosed().subscribe(() => {
      this.load();
    });
  }
  onDelete() {
    const dialogRef = this.dialog.open(ModelAddComponent, {
      data: { action: "Delete", value: this.selectedItem },
    });
    dialogRef.afterClosed().subscribe(() => {
      this.load();
    });
    this.selectedItem = null;
    this.dataGrid.clearSelection();
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
}
