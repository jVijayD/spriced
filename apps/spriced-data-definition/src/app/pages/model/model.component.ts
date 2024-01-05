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
import { Subscription } from "rxjs";
import { DatePipe } from "@angular/common";
import * as moment from "moment";
import { ToolTipRendererDirective } from "libs/spriced-ui-lib/src/lib/components/directive/tool-tip-renderer.directive";
import { Criteria } from "@spriced-frontend/spriced-common-lib";

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
    ToolTipRendererDirective
  ],
  providers: [ModelService],
  templateUrl: "./model.component.html",
  styleUrls: ["./model.component.scss"],
  //changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ModelComponent implements OnInit, OnDestroy {
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
      name: "Last Updated On",
      canAutoResize: true,
      isSortable: true,
      width: 100,

      pipe: (data: any) => {
        return moment(data).format("MM/DD/YYYY HH:mm:ss");
      },
    },

    {
      column: "description",
      name: "Description",
      canAutoResize: true,
      isSortable: true,
      width: 100,
    },
  ];
  columnMode: ColumnMode = ColumnMode.force;
  selectionType: SelectionType = SelectionType.single;
  sortType = SortType.single;
  isFullScreen = false;
  totalElements = 10000;
  rows: any[] = [];
  selectedItem: any = null;
  filterData: any;
  subscriptions: Subscription[] = [];

  @ViewChild(DataGridComponent)
  dataGrid!: DataGridComponent;
  pageNo = 0;
  pageSize = 10;
  temp: any = [];
  query?: any;
  public showTooltip: boolean = false;
  public limit: number = 15;
  public appliedFilters: any;
  public currentCriteria: Criteria = {
    filters:
      [],
    pager: {
      pageNumber: 0,
      pageSize: this.limit,
    },
    sorters: [{ direction: "DESC", property: "updated_date" }]
  };

  constructor(
    private dialogService: DialogService,
    private snackbarService: SnackBarService,
    private dialog: MatDialog,
    private modelService: ModelService
  ) { }

  ngOnInit(): void {
    this.load(this.pageNo, this.pageSize);
  }
  load(pageNo: number, pageSize: number) {
    this.modelService.loadAllModels().subscribe((results: any) => {
      this.rows = results;
      this.totalElements = results.length;
      this.filterData = results;
      const previousItem = this.rows.find((el: any) => el.name === this.selectedItem?.name);
      this.selectedItem = null;
      this.onItemSelected(previousItem);
    });
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((item) => {
      item.unsubscribe();
    });
  }

  onAdd() {
    this.dataGrid.clearSelection();
    this.selectedItem = null;
    const dialogRef = this.dialog.open(ModelAddComponent, {
      data: { action: "Add" },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        // this.load(this.pageNo, this.pageSize);
        this.rows.push(result.data);
        this.rows = [...this.rows];
        this.totalElements = this.rows.length;
        this.selectedItem = null;
      }
    });
  }

  onRefresh() {
    this.query = null;

    this.load(this.pageNo, this.pageSize);
    this.selectedItem = null;
  }

  onEdit() {
    const dialogRef = this.dialog.open(ModelAddComponent, {
      data: { action: "Edit", value: this.selectedItem },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
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
        this.modelService.delete(this.selectedItem.id).subscribe({
          next: (result) => {
            this.snackbarService.success("Succesfully Deleted");
            this.load(this.pageNo, this.pageSize);
            this.selectedItem = null;
          },

          error: (err) => {
            this.snackbarService.error("Record deletion failed.");
          },
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
    const columns: any = this.headers.filter((el: any) => el.column !== 'id');
    const data: FilterData = {
      query: this.query,
      persistValueOnFieldChange: true,
      emptyMessage: "Please select filter criteria.",
      config: null,
      columns: this.getFilterColumns(columns),
    };

    const dialogResult = this.dialogService.openFilterDialog(data);
    dialogResult.afterClosed().subscribe((val) => {
      if (val !== null) {
        this.query = dialogResult.componentInstance.data.query;

        this.temp = [];
        this.rows = this.filterData;
        val.map((item: any, index: number) => {
          this.filteredRows(item);
        });

        const result: any = [...new Set(this.rows)];
        this.rows = result;
      }
    });
  }

  public filteredRows(item: any) {
    if (!!item.operatorType) {
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
        case "IS_NOT_EQUAL": {
          var row = this.filterData.filter(function (el: any) {
            return el[item.key] != item.value;
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
    }
    if (!!item.filters) {
      item.filters.map((el: any) => {
        this.filteredRows(el);
      })
    }
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
          const field = this.getDisplayName(rule?.field);;
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

  getDisplayName(name: string) {
    var headers: any = this.headers.filter((item) => item.column === name);
    if (headers[0]?.column) {
      return headers[0]?.name
    }
  }

  onClearFilter() {
    this.query = null;

    this.load(this.pageNo, this.pageSize);
    this.selectedItem = null;
  }

  getFilterColumns(headers: Header[]): QueryColumns[] {
    return headers
      .map((col: any) => {
        return {
          name: col.column,
          displayName: col.name,
          dataType: !!col.dataType ? col.dataType : "string",
          options: undefined,
        };
      });
  }
}
