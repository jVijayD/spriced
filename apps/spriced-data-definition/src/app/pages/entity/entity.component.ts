import { Component, ViewChild } from "@angular/core";
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
import { MatDialog, MatDialogModule } from "@angular/material/dialog";
import { ModelAddComponent } from "../model/components/model-add/model-add.component";
import { ColumnMode, SelectionType, SortType } from "@swimlane/ngx-datatable";
import { EntityService } from "../../services/entity.service";
import { ModelService } from "../../services/model.service";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatSelectModule } from "@angular/material/select";
import { EntityAddComponent } from "./components/entity-add/entity-add.component";
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
  modelList: any;
  groupId: any;

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
    console.log("load");
    this.entityService.loadEntityByModel(id.value).subscribe((results: any) => {
      this.rows = results;
    });
  }
  onAdd() {
    this.dataGrid.clearSelection();
    const dialogRef = this.dialog.open(EntityAddComponent, {
      data: { action: "Add", entities: this.rows, row: "" },
      //maxWidth: "300px",
      //maxHeight: "400px",
    });
    dialogRef.afterClosed().subscribe(() => {
      // this.load();
    });
  }

  onRefresh() {}

  onEdit() {
    const dialogRef = this.dialog.open(EntityAddComponent, {
      data: { action: "Edit", entities: this.rows, row: this.selectedItem },
    });
    dialogRef.afterClosed().subscribe(() => {
      // this.load();
    });
  }
  onDelete() {
    const dialogRef = this.dialog.open(EntityAddComponent, {
      data: { action: "Delete", entities: this.rows, row: this.selectedItem },
    });
    dialogRef.afterClosed().subscribe(() => {
      // this.load();
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
