import { Component, Inject, inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import {
  DataGridComponent,
  DialogService,
  Header,
  HeaderActionComponent,
  OneColComponent,
  Paginate,
  QueryColumns,
  SnackBarService,
} from "@spriced-frontend/spriced-ui-lib";
import { MatButtonModule } from "@angular/material/button";
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from "@angular/material/dialog";
import { ColumnMode, SelectionType, SortType } from "@swimlane/ngx-datatable";
import { equal } from "assert";
import { DialogRef } from "@angular/cdk/dialog";
import { FilterListService } from "../services/filter-list.service";
import { Criteria } from "@spriced-frontend/spriced-common-lib";
import * as moment from "moment";
import { AddFilterlistComponent } from "../add-filterlist/add-filterlist.component";
import { ToolTipRendererDirective } from "libs/spriced-ui-lib/src/lib/components/directive/tool-tip-renderer.directive";

@Component({
  selector: "sp-saved-filterlist",
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    DataGridComponent,
    MatDialogModule,
    OneColComponent,
    HeaderActionComponent,
    ToolTipRendererDirective,
  ],
  templateUrl: "./saved-filterlist.component.html",
  styleUrls: ["./saved-filterlist.component.scss"],
})
export class SavedFilterlistComponent {
  rows: any[] = [];
  selectedItem: any = null;
  totalElements = 0;
  pageNumber = 0;
  limit: number = 15;
  currentCriteria: Criteria = {
    filters: [],
    pager: {
      pageNumber: 0,
      pageSize: this.limit,
    },
    sorters: [{ direction: "DESC", property: "updated_date" }],
  };
  appliedFilters: any = [];
  query?: any;
  public showTooltip: boolean = false;
  sortType = SortType.single;

  constructor(
    public dialogRef: MatDialogRef<SavedFilterlistComponent>,
    private filterListService: FilterListService,
    private snackbarService: SnackBarService,
    private dialogService: DialogService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
  }
  headers: Header[] = [
    {
      column: "name",
      name: "Name",
      canAutoResize: true,
      isSortable: true,
      width: 100,
      sortColumn: "name",
    },
    {
      column: "description",
      name: "Description",
      canAutoResize: true,
      isSortable: true,
      width: 100,
      sortColumn: "description",
    },
    {
      column: "updatedBy",
      name: "Updated By",
      canAutoResize: true,
      isSortable: true,
      width: 100,
      sortColumn: "updated_by",
    },
    {
      column: "updatedDate",
      name: "Last Updated On",
      canAutoResize: true,
      isSortable: true,
      width: 100,
      pipe: (data: any) => {
        return moment(data).format("MM/DD/YYYY HH:mm:ss");
      },
      sortColumn: "updated_date",
    },
  ];
  columnMode: ColumnMode = ColumnMode.force;
  selectionType: SelectionType = SelectionType.single;
  onItemSelected(event: any) {
    this.selectedItem = event;
  }
  closeDialog() {
    this.dialogRef.close();
  }

  loadFilters() {
    this.currentCriteria.filters = [
      {
        filterType: "CONDITION",
        joinType: "NONE",
        operatorType: "EQUALS",
        key: "entity_id",
        value: this.data.entityId,
        dataType: "number",
      },
    ];
    this.currentCriteria.filters?.push(...this.appliedFilters);
    this.filterListService
      .loadFilters(this.currentCriteria)
      .subscribe((val: any) => {
        this.rows = val.content;
        this.selectedItem = val.content[0];
        this.totalElements = val.totalElements;
      });
  }

  onApply() {
    this.dialogRef.close(this.selectedItem.filters);
  }

  onDelete() {
    const dialog = this.dialogService.openConfirmDialoge({
      message: "Do you want to delete?",
      title: "Delete",
      icon: "delete",
    });

    dialog.afterClosed().subscribe((result) => {
      if (result) {
        this.filterListService.deleteFilter(this.selectedItem.id).subscribe({
          next: (result) => {
            this.snackbarService.success("Filter deleted successfully.");
            this.loadFilters();
          },
          error: (err) => {
            this.snackbarService.error("Delete failed.");
          },
        });
      }
    });
  }

  onEdit() {
    const dialog = this.dialogService.openDialog(AddFilterlistComponent, {
      data: { item: this.selectedItem, action: "Edit" },
    });
    dialog.afterClosed().subscribe((result) => {
      this.loadFilters();
    });
  }

  onPaginate(e: Paginate) {
    this.pageNumber = e.offset;
    const criteria: Criteria = {
      ...this.currentCriteria,
      pager: {
        pageNumber: e.offset,
        pageSize: this.limit,
      },
    };
    this.currentCriteria = criteria;
    this.loadFilters();
  }

  onFilter() {
    this.currentCriteria.filters = [];
    this.currentCriteria.sorters = [];
    this.currentCriteria.pager = {
      pageNumber: 0,
      pageSize: this.limit,
    };
    const dialogResult = this.dialogService.openFilterDialog({
      persistValueOnFieldChange: true,
      columns: this.getFilterColumns(this.headers),
      emptyMessage: "Please select filter criteria.",
      config: null,
      query: this.query,
    });
    dialogResult.afterClosed().subscribe((val) => {
      if (val) {
        this.query = dialogResult.componentInstance.data.query;
        this.addDisplayNameInFilter(this.query);
        this.appliedFilters = val;
        this.appliedFilters?.length == 0 ? (this.query = null) : "";
        this.loadFilters();
      }
    });
  }

  getFilterColumns(headers: Header[]): QueryColumns[] {
    return headers.map((col: any) => {
      return {
        name: col.sortColumn,
        displayName: col.name,
        dataType: "string",
        options: col?.dataType === "category" ? col.options : undefined,
      };
    });
  }

  onClearFilter() {
    this.query = null;
    this.currentCriteria.filters = [];
    this.appliedFilters = [];
    this.loadFilters();
  }
  /**
   * HANDLE THIS FUNCTION FOR ADD DISPLAY NAME IN FILTER QUERY
   * @param query any
   */
  public addDisplayNameInFilter(query: any) {
    if (query.rules) {
      query.rules.forEach((el: any) => {
        const item: any = this.headers.find(
          (elm: any) => elm.column === el.field
        );
        if (el?.rules && el?.rules.length > 0) {
          this.addDisplayNameInFilter(el); // Recursively process sub-rules
        }
        if (!!item) {
          el.displayName = item.name;
        }
        return;
      });
    }
  }

  public getToolTipTemplate(conditions: any): string {
    this.showTooltip = !!conditions;
    if (!conditions || conditions.length === 0) {
      return "";
    }
    const text: any = this.getTooltipText(conditions);
    return text;
  }
  getDisplayName(name: string) {
    var headers: any = this.headers.filter((item) => item.sortColumn === name);
    if (headers[0]?.sortColumn) {
      return headers[0]?.name;
    }
  }

  public getTooltipText(items: any): string {
    let tooltipText = "";
    if (items.condition && items.rules && items.rules.length > 0) {
      const lastItem = items.rules.length - 1;
      items.rules.forEach((rule: any, index: number) => {
        if (!rule.condition && !rule.rules) {
          const field = this.getDisplayName(rule?.field);
          const value = !!rule?.value ? rule?.value : "";
          const condition = lastItem !== index ? items.condition : "";
          tooltipText += `<strong>${field}</strong> ${rule.operator} ${value} <strong>${condition}</strong> <br>`;
        }
        if (!!rule.condition && !!rule.rules) {
          tooltipText += `(`;
          tooltipText += this.getNestedTooltipText(rule);
          tooltipText += "<br>";
        }
      });
    } else if (items.field && items.operator && items.value) {
      tooltipText += `${items.condition} <strong>${items.field}</strong> ${items.operator} ${items.value}`;
    }
    return tooltipText;
  }

  public getNestedTooltipText(items: any): string {
    let tooltipText = "";
    if (items.condition && items.rules && items.rules.length > 0) {
      const lastItem = items.rules.length - 1;
      items.rules.forEach((rule: any, index: number) => {
        if (!rule.condition && !rule.rules) {
          const field = this.getDisplayName(rule?.field);
          const value = !!rule?.value ? rule?.value : "";
          const condition = lastItem !== index ? items.condition : "";
          tooltipText += `<strong>${field}</strong> ${rule.operator} ${value} <strong>${condition}</strong>`;
          if (index < items.rules.length - 1) {
            tooltipText += "<br>";
          }
        }
        if (!!rule.condition && !!rule.rules) {
          tooltipText += `(`;
          tooltipText += this.getNestedTooltipText(rule);
        }
      });
    }
    tooltipText += ")";
    return tooltipText;
  }

  onSort(e: any) {
    const sorters = e.sorts.map((sort: any) => {
      return { direction: sort.dir.toUpperCase(), property: sort.prop };
    });
    this.currentCriteria = { ...this.currentCriteria, sorters: sorters };
    this.loadFilters();
  }
}
