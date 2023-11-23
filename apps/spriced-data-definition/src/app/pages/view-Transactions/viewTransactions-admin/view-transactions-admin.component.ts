import { Component, Inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import {
  DataGridComponent,
  DialogService,
  DialogueModule,
  Header,
  HeaderActionComponent,
  HeaderComponentWrapperComponent,
  OrderByPipe,
  Paginate,
  QueryColumns,
} from "@spriced-frontend/spriced-ui-lib";
import {
  ColumnMode,
  Model,
  SelectionType,
  SortType,
} from "@swimlane/ngx-datatable";
import * as moment from "moment";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatTabsModule } from "@angular/material/tabs";
import { MatTableModule } from "@angular/material/table";
import { MatSelectChange, MatSelectModule } from "@angular/material/select";
import { MatInputModule } from "@angular/material/input";
import { MatIconModule } from "@angular/material/icon";
import { ToolTipRendererDirective } from "libs/spriced-ui-lib/src/lib/components/directive/tool-tip-renderer.directive";
import { TransactionsService } from "./service/transactions.service";
import {
  Criteria,
  Entity,
  EntityService,
} from "@spriced-frontend/spriced-common-lib";
import { ModelService } from "../../../services/model.service";
import { Subject, forkJoin } from "rxjs";
import { NgxMatSelectSearchModule } from "ngx-mat-select-search";
import { MatToolbarModule } from "@angular/material/toolbar";
import { FormsModule } from "@angular/forms";
@Component({
  selector: "sp-view-transactions-admin",
  standalone: true,
  imports: [
    CommonModule,
    DataGridComponent,
    MatToolbarModule,
    HeaderComponentWrapperComponent,
    MatFormFieldModule,
    MatIconModule,
    MatTabsModule,
    MatTableModule,
    MatInputModule,
    MatSelectModule,
    DialogueModule,
    HeaderActionComponent,
    NgxMatSelectSearchModule,
    ToolTipRendererDirective,
    NgxMatSelectSearchModule,
    OrderByPipe,
    FormsModule
  ],
  providers: [DialogService],
  templateUrl: "./view-transactions-admin.component.html",
  styleUrls: ["./view-transactions-admin.component.scss"],
})
export class ViewTransactionsAdminComponent {
  selectedItem: any;
  selectedModel: any;
  sortType = SortType.single;
  columnMode: ColumnMode = ColumnMode.force;
  selectionType: SelectionType = SelectionType.single;
  totalElements = 0;
  public showTooltip: boolean = false;
  rows: any[] = [];
  filters:any;
  limit: number = 15;
  modelList!: any[];
  entityList!: any[];
  query?: any;
  subscriptions: any[] = [];
  pageNumber!:number;
  currentCriteria: Criteria = {
    filters: [],
    pager: {
      pageNumber: 0,
      pageSize: this.limit,
    },
    sorters:[{ direction:"DESC" ,property: "updated_date" }]
  };
  filteredModelList: any;

  constructor(
    private modelService: ModelService,
    private enitityService: EntityService,
    private transactionService: TransactionsService,
    private dialogService:DialogService,
  ) {}
  headers: Header[] = [
    {
      canAutoResize: true,
      isSortable: true,
      isFilterable: true,
      column: "entityName",
      name: "Entity",
      sortColumn:"entity_name"
    },

    {
      canAutoResize: true,
      isSortable: true,
      isFilterable: true,
      column: "columnName",
      name: "Attribute",
      sortColumn:"column_name"

    },
    {
      canAutoResize: true,
      isSortable: true,
      isFilterable: true,
      column: "updatedDate",
      name: "Last Updated On",
      pipe: (data: any) => {
        return moment(data).format("MM/DD/YYYY HH:mm:ss");
      },
      sortColumn:"updated_date"
    },
    {
      canAutoResize: true,
      isSortable: true,
      isFilterable: true,
      column: "priorValue",
      name: "Prior Value",
      sortColumn:"prior_value"
    },
    {
      canAutoResize: true,
      isSortable: true,
      isFilterable: true,
      column: "newValue",
      name: "New value",
      sortColumn:"new_value"
    },
    {
      canAutoResize: true,
      isSortable: true,
      isFilterable: true,
      column: "updatedBy",
      name: "User",
      sortColumn:"updated_by"
    },
    {
      canAutoResize: true,
      isSortable: true,
      isFilterable: true,
      column: "transactionType",
      name: "Transaction",
      sortColumn:"transaction_type"
    },
  ];

  onModelChange(ev: MatSelectChange) {
    this.onClearFilter()
    this.selectedModel = ev.value;
  }
  onPaginate(e: Paginate) {
    this.pageNumber = e.offset;
    if (
      this.currentCriteria.filters &&
      this.currentCriteria.filters.length > 0 &&
      this.currentCriteria.pager
    ) {
      this.currentCriteria.pager.pageNumber = e.offset;
      this.loadTransactionsData(this.selectedModel);
    }
  }

  onItemSelected(e: any) {
    this.selectedItem = e;
  }

  onSort(e: any) {
    console.log(e)
    const sorters = e.sorts.map((sort: any) => {
      return { direction: sort.dir.toUpperCase(), property: sort.prop };
    });
    this.currentCriteria = { ...this.currentCriteria, sorters: sorters };
    this.loadTransactionsData(this.selectedModel);
  }

  ngOnInit() {
    this.subscriptions.push(
      this.modelService.loadAllModels().subscribe((result: any) => {
        this.modelList = result;
        this.filteredModelList = this.modelList;
        this.selectedModel = this.modelList[0].id;
        this.loadTransactionsData(this.selectedModel);
      })
    );
  }
  loadTransactionsData(modelId: number) {
   this.rows = [];
   const filters =this.createFilters("group_id",modelId,"number");
   this.currentCriteria.filters?.push(filters);
    this.transactionService.loadTransactionsData(this.currentCriteria).subscribe({
      next:(res:any)=>{
        this.totalElements = res.totalElements;
        this.rows = res.content;
      },
      error:(err:any)=>{
        console.log(err);
      }
    })
  }

  onFilter(){
    this.currentCriteria.filters = [];
    this.currentCriteria.sorters = [];
    const dialogResult = this.dialogService.openFilterDialog({
      persistValueOnFieldChange: true,
      columns:this.getFilterColumns(this.headers),
      emptyMessage: "Please select filter criteria.",
      config: null,
      query: this.query,
    });
    dialogResult.afterClosed().subscribe((val) => {
      if(val){
      this.query = dialogResult.componentInstance.data.query;
      this.addDisplayNameInFilter(this.query);
      this.currentCriteria.filters = val;
      this.currentCriteria.filters?.length==0 ?this.query = null:'';
      this.loadTransactionsData(this.selectedModel)
    }
    });
   }

   getFilterColumns(headers: Header[]): QueryColumns[] {
    return headers
      .map((col: any) => {
        return {
          name: col.sortColumn,
          displayName: col.name,
          dataType:  "string",
          options: col?.dataType === "category" ? col.options : undefined,
        };
      });
  }


  onClearFilter(){
    this.query = null;
    this.currentCriteria.filters = [];
    this.loadTransactionsData(this.selectedModel);
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
  getDisplayName(name:string)
  {
    var headers: any  = this.headers.filter((item) =>item.sortColumn === name);
    if (headers[0]?.sortColumn) {
     return headers[0]?.name
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

  createFilters(key:string,value:any,type:string){
    return  {
      filterType: "CONDITION",
      key: key,
      value: value,
      joinType: "AND",
      operatorType: "EQUALS",
      dataType: type,
    };
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((item) => item.unsubscribe());
  }
  filterModelSelection(text: any) {
    console.log(text)
    this.filteredModelList = this.modelList.filter((item: any) => {
      return (
        item.displayName
          .trim()
          .toLowerCase()
          .indexOf(text.trim().toLowerCase()) != -1
      );
    });
    console.log(this.filteredModelList)
  }

}
