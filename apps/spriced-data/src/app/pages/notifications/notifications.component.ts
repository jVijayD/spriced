import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import {
  OneColComponent,
  DataGridComponent,
  Header,
  DialogService,
  QueryColumns,
  HeaderActionComponent,
  ToolTipRendererDirective,
  DialogueModule,
} from "@spriced-frontend/spriced-ui-lib";
import { ColumnMode, SelectionType, SortType } from "@swimlane/ngx-datatable";
import { Criteria } from "@spriced-frontend/spriced-common-lib";
import { NotificationService } from "../../services/notification.service";

@Component({
  selector: "sp-notifications",
  standalone: true,
  imports: [
    CommonModule,
    OneColComponent,
    DataGridComponent,
    HeaderActionComponent,
    ToolTipRendererDirective,
    DialogueModule
  ],
  templateUrl: "./notifications.component.html",
  styleUrls: ["./notifications.component.scss"],
  providers: [DialogService],
})
export class NotificationsComponent {
  showTooltip = false;
  constructor(
    private notificationService: NotificationService,
    private dialogService: DialogService
  ) {}
  query?: any;
  headers: Header[] = [
    {
      column: "type",
      name: "Type",
      canAutoResize: true,
      isSortable: true,
      width: 100,
    },
    {
      column: "description",
      name: "Description",
      canAutoResize: true,
      isSortable: true,
      width: 100,
    },
    {
      column: "status",
      name: "Status",
      canAutoResize: true,
      isSortable: true,
      width: 100,
    },
    {
      column: "updated_byUpdated By",
      name: "Updated By",
      canAutoResize: true,
      isSortable: true,
      width: 100,
    },
    {
      column: "updated_date",
      name: "Last Updated On",
      canAutoResize: true,
      isSortable: true,
      width: 100,
    },
    // {
    //   column: "action",
    //   name: "Action",
    //   canAutoResize: true,
    //   isSortable: true,
    //   width: 100,
    //   isLink:true
    // },
  ];
  columnMode: ColumnMode = ColumnMode.force;
  selectionType: SelectionType = SelectionType.single;
  sortType = SortType.single;
  isFullScreen = false;
  totalElements = 10000;
  rows: any[] = [
    { notification: "shd", description: "sgadhgasd", action: "link" },
  ];
  selectedItem: any = null;
  limit: number = 50;

  currentCriteria: Criteria = {
    filters: [],
    pager: {
      pageNumber: 0,
      pageSize: this.limit,
    },
    sorters: [{ direction: "DESC", property: "updated_date" }],
  };
  onItemSelected(event: any) {}
  onSort(e: any) {
    const sorters = e.sorts.map((sort: any) => {
      return { direction: sort.dir.toUpperCase(), property: sort.prop };
    });
    this.currentCriteria = { ...this.currentCriteria, sorters: sorters };
    this.loadNotification(this.currentCriteria);
  }
  onPaginate(e: any) {
    const criteria: Criteria = {
      ...this.currentCriteria,
      pager: {
        pageNumber: e.offset,
        pageSize: this.limit,
      },
    };
    this.loadNotification(criteria);
  }
  private loadNotification(criteria: Criteria) {
    this.notificationService.loadNotification(criteria).subscribe({
      next: (page) => {
        this.rows = page.content;
        this.totalElements = page.totalElements;
      },
      error: (err) => {
        this.rows = [];
      },
    });
  }

  onFilter() {
    this.currentCriteria.filters = [];
    this.currentCriteria.sorters = [];
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
        this.currentCriteria.filters=val
        this.addDisplayNameInFilter(this.query);
        this.loadNotification(this.currentCriteria);
      }
    });
  }
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
    var headers: any = this.headers.filter((item) => item.column === name);
    if (headers[0]?.column) {
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

  getFilterColumns(headers: Header[]): QueryColumns[] {
    return headers.map((col: any) => {
      return {
        name: col.column,
        displayName: col.name,
        dataType: "string",
        options: col?.dataType === "category" ? col.options : undefined,
      };
    });
  }
  onClearFilter() {
    this.query = null;
    this.currentCriteria.filters = [];
    this.loadNotification(this.currentCriteria);
  }
}
