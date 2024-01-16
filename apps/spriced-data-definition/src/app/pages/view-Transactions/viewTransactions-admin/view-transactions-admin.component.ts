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
  SnackBarService,
  SnackbarModule,
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
import { group } from "console";
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
    FormsModule,
    SnackbarModule,
  ],
  providers: [DialogService],
  templateUrl: "./view-transactions-admin.component.html",
  styleUrls: ["./view-transactions-admin.component.scss"],
})
export class ViewTransactionsAdminComponent {
  selectedItem: any=null;
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
    filters:
       [],
    pager: {
      pageNumber: 0,
      pageSize: this.limit,
    },
    sorters:[{ direction:"DESC" ,property: "updated_date" }]
  };
  filteredModelList: any;
  appliedFilters: any=[];
  selectedEntity: any;
  filteredEntityList: any

  constructor(
    private modelService: ModelService,
    private enitityService: EntityService,
    private transactionService: TransactionsService,
    private dialogService:DialogService,
    private snackbarService: SnackBarService,
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
      sortColumn:"prior_value",
      pipe: (data: any) => {
        var momentDate=moment(data?.toString().replaceAll("Z",""), "YYYY-MM-DDTHH:mm:ss", true)
        if(momentDate.isValid())
        {
         return moment(data).format("MM/DD/YYYY");
        }
        else
        {
         return data
        }
      },
    },
    {
      canAutoResize: true,
      isSortable: true,
      isFilterable: true,
      column: "newValue",
      name: "New value",
      sortColumn:"new_value",
        pipe: (data: any) => {
          var momentDate=moment(data?.toString().replaceAll("Z",""), "YYYY-MM-DDTHH:mm:ss", true)
          if(momentDate.isValid())
          {
           return moment(data).format("MM/DD/YYYY");
          }
          else
          {
           return data
          }
        },
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

  onModelChange(ev: any) {
    this.reset();
    this.selectedModel = ev.value;
    this.enitityService
      .loadEntityByModel(this.selectedModel)
      .subscribe((result: any) => {
        this.entityList = result;
        this.filteredEntityList = result;
        this.filteredEntityList.sort((a:any,b:any) => a.displayName.localeCompare(b.displayName));
        this.selectedEntity = this.filteredEntityList[0]?.id;
        this.appliedFilters = [];
        this.onEntitySelectionChange({ value: this.selectedEntity });
      });
  }

  onEntitySelectionChange(entity: any) {
    this.reset();
    this.selectedEntity = entity.value;
    this.appliedFilters = [];
    if (this.selectedEntity) {
      this.loadTransactionsData();
    }
  }

  reset() {
    this.selectedItem = null;
    this.currentCriteria.pager = {
      pageNumber: 0,
      pageSize: this.limit,
    };
    this.pageNumber = 0;
    this.totalElements = 0;
    this.selectedEntity = undefined;
    this.query = null;
    this.currentCriteria.filters = [];
    this.appliedFilters = [];
  }

  onPaginate(e: Paginate) {
    this.pageNumber = e.offset;
    if (
      this.currentCriteria.filters &&
      this.currentCriteria.filters.length > 0 &&
      this.currentCriteria.pager
    ) {
      this.currentCriteria.pager.pageNumber = e.offset;
      this.loadTransactionsData();
    }
  }

  onItemSelected(e: any) {
    this.selectedItem = e;
  }

  onSort(e: any) {
    const sorters = e.sorts.map((sort: any) => {
      return { direction: sort.dir.toUpperCase(), property: sort.prop };
    });
    this.currentCriteria = { ...this.currentCriteria, sorters: sorters };
    this.loadTransactionsData();
  }

  ngOnInit() {
    this.subscriptions.push(
      this.modelService.loadAllModels().subscribe((result: any) => {
        this.modelList = result;
        this.filteredModelList = this.modelList;
        this.selectedModel = this.modelList[0]?.id;
        this.onModelChange({value:this.selectedModel})
      })
    );
  }
  loadTransactionsData() {
   this.rows = [];
   this.currentCriteria.filters =this.createFilters();
   this.currentCriteria.filters?.push(...this.appliedFilters);
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
      this.appliedFilters = val;
      this.appliedFilters?.length==0 ?this.query = null:'';
      this.loadTransactionsData()
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
    this.appliedFilters=[]
    this.loadTransactionsData();
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

  createFilters(){
    return [{
      filterType: "CONDITION",
      key: "group_id",
      value: this.selectedModel,
      joinType: "AND",
      operatorType: "EQUALS",
      dataType: "number",
    },
    {
      filterType: "CONDITION",
      key: "entity_id",
      value: this.selectedEntity,
      joinType: "AND",
      operatorType: "EQUALS",
      dataType: "number",
    },
    {
      "filterType": "CONDITION",
      "key": "column_name",
      "value": "Updated By",
      "joinType": "AND",
      "operatorType": "IS_NOT_EQUAL",
      "dataType": "string"
  },
  {
      "filterType": "CONDITION",
      "key": "column_name",
      "value": "Updated Date",
      "joinType": "AND",
      "operatorType": "IS_NOT_EQUAL",
      "dataType": "string"
  },
  {
      "filterType": "CONDITION",
      "key": "column_name",
      "value": "Annotation",
      "joinType": "AND",
      "operatorType": "IS_NOT_EQUAL",
      "dataType": "string"
  },
  {
      "filterType": "CONDITION",
      "key": "column_name",
      "value": "Last Update On",
      "joinType": "AND",
      "operatorType": "IS_NOT_EQUAL",
      "dataType": "string"
  },
  {
      "filterType": "CONDITION",
      "key": "column_name",
      "value": "Is Valid",
      "joinType": "AND",
      "operatorType": "IS_NOT_EQUAL",
      "dataType": "string"
  },
  {
      "filterType": "CONDITION",
      "key": "column_name",
      "value": "Id",
      "joinType": "AND",
      "operatorType": "IS_NOT_EQUAL",
      "dataType": "string"
  },
  {
      "filterType": "CONDITION",
      "key": "column_name",
      "value": "id",
      "joinType": "AND",
      "operatorType": "IS_NOT_EQUAL",
      "dataType": "string"
  },
  {
      "filterType": "CONDITION",
      "key": "column_name",
      "value": "Validation Status",
      "joinType": "AND",
      "operatorType": "IS_NOT_EQUAL",
      "dataType": "string"
  }
]
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((item) => item.unsubscribe());
  }
  filterModelSelection(text: any) {
    this.filteredModelList = this.modelList.filter((item: any) => {
      return (
        item.displayName
          .trim()
          .toLowerCase()
          .indexOf(text.trim().toLowerCase()) != -1
      );
    });
  }
  filterEntitySelection(text: any) {
    this.filteredEntityList = this.entityList.filter((item: any) => {
      return (
        item.displayName
          .trim()
          .toLowerCase()
          .indexOf(text.trim().toLowerCase()) != -1
      );
    });
  }
onRevert()
{
  let criteria:Criteria=
      {
      "filters": [
          {
              "filterType": "CONDITION",
              "joinType": "AND",
              "operatorType": "EQUALS",
              "key": "id",
              "value":this.selectedItem.entityId,
              "dataType": "number"
          }    
      ],
      "pager": {
          "pageNumber": 0,
          "pageSize": 15
      },
      "sorters": []
    }


    const dialogRef = this.dialogService.openConfirmDialoge({
      message: "Do you want to Reverse?",
      title: "Reverse Transaction",
      icon: "undo",
    });
    dialogRef.afterClosed().subscribe((result: any) => {
      if (result == true) {
        this.transactionService.auditReversal(this.selectedItem,criteria).subscribe({
          next:(res:any)=>{
            this.snackbarService.success(res);
            this.loadTransactionsData();
          },
          error:(err:any)=>{
            this.snackbarService.error("The selected row cannot be reversed");
          }
        })
      }
    });


}
}
