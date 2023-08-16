import { Component, Inject, Optional } from "@angular/core";
import { CommonModule } from "@angular/common";
import {
  DataGridComponent,
  DialogService,
  Header,
  Paginate,
} from "@spriced-frontend/spriced-ui-lib";
import { ColumnMode, SelectionType, SortType } from "@swimlane/ngx-datatable";
import { EntityDataService } from "../../services/entity-data.service";
import {
  Attribute,
  Criteria,
  Entity,
} from "@spriced-frontend/spriced-common-lib";
import { Subscription } from "rxjs";
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from "@angular/material/dialog";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { EntityGridService } from "../../pages/entity-data/entity-grid.service";

@Component({
  selector: "sp-lookup-popup",
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    DataGridComponent,
    MatIconModule,
    MatButtonModule,
  ],
  templateUrl: "./lookup-popup.component.html",
  styleUrls: ["./lookup-popup.component.scss"],
})
export class LookupPopupComponent {
  limit: number = 8;
  isFullScreen = false;
  headers: Header[] = [];
  columnMode: ColumnMode = ColumnMode.force;
  selectionType: SelectionType = SelectionType.single;
  sortType = SortType.single;
  selectedItem: any;
  totalElements = 0;
  rows: any[] = [];
  currentSelectedEntity?: Entity;
  subscriptions: Subscription[] = [];
  currentCriteria!: Criteria;
  query?: any;

  constructor(
    private entityDataService: EntityDataService,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<LookupPopupComponent>,
    private dialogService: DialogService,
    private entityGridService: EntityGridService
  ) {
    this.entityDataService.loadEntity(data).subscribe({
      next: (result: any) => {
        this.currentSelectedEntity = result;
        this.createDynamicGrid(this.currentSelectedEntity);
      },
      error: (err) => {
        console.error(err);
      },
    });
  }

  private createDynamicGrid(entity: Entity | undefined) {
    if (entity) {
      this.headers = entity.attributes
        .filter((item) => {
          return item.permission !== "DENY";
        })
        .map((attr: Attribute) => {
          return {
            column: attr.name,
            name: attr.displayName || attr.name,
            canAutoResize: true,
            isSortable: true,
            isFilterable: true,
            dataType: this.getColumnDataType(attr),
            options: this.getOptions(attr),
          };
        });
      this.loadEntityData(entity, {
        pager: { pageNumber: 0, pageSize: this.limit },
      });
    }
  }
  private getColumnDataType(
    attr: Attribute
  ): "string" | "number" | "date" | "category" | "boolean" {
    debugger;
    switch (attr.dataType) {
      case "STRING_VAR":
      case "TEXT":
      case "LINK":
        return "string";
      case "TIME_STAMP":
        return "date";
      case "BOOLEAN":
        return "boolean";
      case "INTEGER":
      case "SERIAL":
      case "AUTO":
        return "number";
      default:
        return "string";
    }
  }

  private getOptions(
    attr: Attribute
  ): { name: string; value: any }[] | undefined {
    let options = undefined;
    if (attr.dataType === "BOOLEAN") {
      options = [
        { name: "True", value: true },
        { name: "False", value: false },
      ];
    }
    return options;
  }

  private loadEntityData(entity: Entity, criteria: Criteria) {
    if (entity) {
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

  onSort(e: any) {
    const sorters = e.sorts.map((sort: any) => {
      return { direction: sort.dir.toUpperCase(), property: sort.prop };
    });
    const criteria: Criteria = { ...this.currentCriteria, sorters: sorters };
    this.loadEntityData(this.currentSelectedEntity as Entity, criteria);
  }

  onItemSelected(e: any) {
    this.selectedItem = e;
  }

  onClose() {
    this.dialogRef.close({ event: "Cancel", data: this.selectedItem });
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
}
