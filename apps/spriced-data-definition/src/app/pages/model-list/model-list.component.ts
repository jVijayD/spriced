import { Component, ViewChild } from "@angular/core";
import { CommonModule } from "@angular/common";
import {
  DataGridComponent,
  DataGridTreeComponent,
  DialogService,
  DialogueModule,
  Head,
  Header,
  HeaderActionComponent,
  OneColComponent,
  Paginate,
  SnackBarService,
  SnackbarModule,
} from "@spriced-frontend/spriced-ui-lib";
import { MatDialog, MatDialogModule } from "@angular/material/dialog";
import { ColumnMode, SelectionType, SortType } from "@swimlane/ngx-datatable";
import { ModelService } from "../../services/model.service";
import { ModelAddComponent } from "../model/components/model-add/model-add.component";
import { EntityService } from "../../services/entity.service";
import * as moment from "moment";
import { Router } from "@angular/router";

@Component({
  selector: "sp-model-list",
  standalone: true,
  imports: [
    CommonModule,
    DataGridTreeComponent,
    OneColComponent,
    HeaderActionComponent,
    DialogueModule,
    SnackbarModule,
    MatDialogModule,
  ],
  templateUrl: "./model-list.component.html",
  styleUrls: ["./model-list.component.scss"],
})
export class ModelListComponent {
  headers: Head[] = [
    {
      column: "displayName",
      name: "Display Name",
      canAutoResize: true,
      isSortable: true,
      isTreeColumn: true,
    },
    {
      column: "updatedBy",
      name: "Updated By",
      canAutoResize: true,
      isSortable: true,
      isTreeColumn: false,
    },
    {
      column: "updatedDate",
      name: "Updated Date",
      canAutoResize: true,
      isSortable: true,
      isTreeColumn: false,
      pipe: (data: any) => {
        return moment(data).format("MM/DD/YYYY HH:mm:ss ");
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
  entities: any;

  constructor(
    private dialogService: DialogService,
    private snackbarService: SnackBarService,

    private modelService: ModelService,
    private entityService: EntityService,
    private router: Router
  ) {}
  ngOnInit(): void {
    this.load();
  }
  load() {
    this.modelService.loadAllModels().subscribe((data: any) => {
      this.rows = data.map((d: any) => {
        d.treeStatus = "collapsed";
        d.parentId = null;
        d.icon = "schema";
        return d;
      });
      this.totalElements = data.length;
    });
  }
  onTreeAction(event: any) {
    const row = event.row;
    if (row.treeStatus === "collapsed") {
      if (row.expandedOnce !== true) {
        row.treeStatus = "loading";
        if (row.level == 0) {
          this.entityService
            .loadEntityByModel(row.id)
            .subscribe((data: any) => {
              row.expandedOnce = true;
              this.entities = data.map((d: any) => {
                d.treeStatus = "collapsed";
                d.parentId = row.id;
                d.icon = "table_chart";
                d.id = d.name + d.id;
                return d;
              });
              row.treeStatus = "expanded";
              this.rows = [...this.rows, ...this.entities];
            });
        } else {
          this.entities = row.attributes.map((d: any) => {
            row.expandedOnce = true;
            d.treeStatus = "disabled";
            d.parentId = row.id;
            d.icon = "view_column";
            d.displayName = d.displayName || d.name;
            return d;
          });
          row.treeStatus = "expanded";
          this.rows = [...this.rows, ...this.entities];
        }
      } else {
        row.treeStatus = "expanded";
        this.rows = [...this.rows];
      }
    } else {
      row.treeStatus = "collapsed";
      this.rows = [...this.rows];
    }
  }

  onRefresh() {
    this.load();
  }

  onView() {
    const data = { ...this.selectedItem };
    data.id = data.id.replace(data.name, "");
    this.router.navigate(["/spriced-data/" + data.groupId + "/", data.id]);
  }
  onAdd() {}
  onPaginate(e: Paginate) {
    //this.rows = this.getData(e.limit, e.offset);
  }

  /**
   * HANDLE THIS FUNCTION FOR DOUBLE CLICK NAVIGATE ENTITY
   */
  onRowDoubleClick()
  {
    this.onView();
  }

  onItemSelected(e: any) {
    this.selectedItem = e;
    console.log(e);
  }

  onSort(e: any) {
    console.log(e);
  }
}
