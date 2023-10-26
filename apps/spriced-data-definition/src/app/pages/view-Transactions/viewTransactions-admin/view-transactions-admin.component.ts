import { Component, Inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import {
  DataGridComponent,
  DialogService,
  DialogueModule,
  Header,
  HeaderActionComponent,
  HeaderComponentWrapperComponent,
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
  limit: number = 10;
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
  };
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
      column: "entity_name",
      name: "Entity",
    },

    {
      canAutoResize: true,
      isSortable: true,
      isFilterable: true,
      column: "column_name",
      name: "Attribute",
    },
    {
      canAutoResize: true,
      isSortable: true,
      isFilterable: true,
      column: "updated_date",
      name: "Last Updated On",
      pipe: (data: any) => {
        return moment(data).format("MM/DD/YYYY HH:mm:ss");
      },
    },
    {
      canAutoResize: true,
      isSortable: true,
      isFilterable: true,
      column: "prior_value",
      name: "Prior Value",
    },
    {
      canAutoResize: true,
      isSortable: true,
      isFilterable: true,
      column: "new_value",
      name: "New value",
    },
    {
      canAutoResize: true,
      isSortable: true,
      isFilterable: true,
      column: "updated_by",
      name: "User",
    },
    {
      canAutoResize: true,
      isSortable: true,
      isFilterable: true,
      column: "transaction_type",
      name: "Transaction",
    },
  ];

  onModelChange(ev: MatSelectChange) {
    this.selectedModel = ev.value;
    this.loadEntitiesById(this.selectedModel);
  }
  onPaginate(e: Paginate) {
    this.pageNumber = e.offset;
    if (
      this.currentCriteria.filters &&
      this.currentCriteria.filters.length > 0 &&
      this.currentCriteria.pager
    ) {
      this.currentCriteria.pager.pageNumber = e.offset;
      this.loadTransactionsData(this.entityList);
    }
  }

  onItemSelected(e: any) {
    this.selectedItem = e;
  }

  onSort(e: any) {
    console.log(e);
  }

  ngOnInit() {
    this.subscriptions.push(
      this.modelService.loadAllModels().subscribe((result: any) => {
        this.modelList = result;
        this.selectedModel = this.modelList[0].id;
        this.loadEntitiesById(this.selectedModel);
      })
    );
  }

  loadEntitiesById(modelId: number) {
    this.enitityService.loadEntityByModel(modelId).subscribe((entities) => {
      this.entityList = entities;
      this.loadTransactionsData(entities);
    });
  }

  loadTransactionsData(entities: any) {
    this.rows = [];
    const observables = entities.map((item: any) => {
      this.currentCriteria.filters = [];
      let newFilter = {
        filterType: "CONDITION",
        key: "entity_name",
        value: item.name,
        joinType: "NONE",
        operatorType: "EQUALS",
        dataType: "string",
      };
      this.currentCriteria.filters?.push(newFilter);
      return this.transactionService.loadTransactionsData(this.currentCriteria);
    });

    forkJoin(observables).subscribe(
      (results: any) => {
        const combinedContent = [].concat(
          ...results.map((item: any) => item.content)
        );
        this.totalElements = results[0].totalElements;
        this.rows = combinedContent;
      },
      (error: any) => {}
    );
  }

  onFilter(){
    debugger
    const dialogResult = this.dialogService.openFilterDialog({
      persistValueOnFieldChange: true,
      columns:this.getFilterColumns(this.headers),
      emptyMessage: "Please select filter criteria.",
      config: null,
      query: this.query,
    });
    dialogResult.afterClosed().subscribe((val) => {
      this.query = dialogResult.componentInstance.data.query;
      this.addDisplayNameInFilter(this.query);
      this.currentCriteria.filters = val;
      // this.loadTransactionsData(modelId,this.currentCriteria)
    });
   }

   getFilterColumns(headers: Header[]): QueryColumns[] {
    return headers
      .map((col: any) => {
        return {
          name: col.column,
          displayName: col.name,
          dataType:  "string",
          options: col?.dataType === "category" ? col.options : undefined,
        };
      });
  }


  onClearFilter(){
    this.query = null;
    this.currentCriteria.filters = [];
    // this.loadTransactionsData(modelId,this.currentCriteria)
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
          const field = rule?.displayName;
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
    debugger
    let tooltipText = "";
    if (items.condition && items.rules && items.rules.length > 0) {
      const lastItem = items.rules.length - 1;
      items.rules.forEach((rule: any, index: number) => {
        if (!rule.condition && !rule.rules) {
          const field = rule?.displayName;
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


  ngOnDestroy(): void {
    this.subscriptions.forEach((item) => item.unsubscribe());
  }
}
