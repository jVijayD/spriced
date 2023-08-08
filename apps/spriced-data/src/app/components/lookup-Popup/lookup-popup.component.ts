import { Component, Inject, Optional } from "@angular/core";
import { CommonModule } from "@angular/common";
import {
  DataGridComponent,
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

  constructor(
    private entityDataService: EntityDataService,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<LookupPopupComponent>
  ) {
    this.currentSelectedEntity = data;
    this.createDynamicGrid(this.currentSelectedEntity);
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
    this.dialogRef.close({ event: "Cancel" });
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
}
