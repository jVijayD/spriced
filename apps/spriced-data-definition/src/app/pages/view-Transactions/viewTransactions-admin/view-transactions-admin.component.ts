import { Component, Inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import {
  DataGridComponent,
  Header,
  HeaderActionComponent,
  HeaderComponentWrapperComponent,
  Paginate,
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
import { forkJoin } from "rxjs";
@Component({
  selector: "sp-view-transactions-admin",
  standalone: true,
  imports: [
    CommonModule,
    DataGridComponent,
    HeaderComponentWrapperComponent,
    MatFormFieldModule,
    MatIconModule,
    MatTabsModule,
    MatTableModule,
    MatInputModule,
    MatSelectModule,
    HeaderActionComponent,
    ToolTipRendererDirective,
  ],
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
  rows: any[] = [];
  limit: number = 15;
  modelList!: any[];
  entityList!: any[];
  query?: any;
  subscriptions: any[] = [];
  currentCriteria: Criteria = {
    filters: [],
    pager: {
      pageNumber: 0,
      pageSize: this.limit,
    },
    sorters:[{ direction:"DESC" ,property: "updated_date" }]
  };
  constructor(
    private modelService: ModelService,
    private enitityService: EntityService,
    private transactionService: TransactionsService
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
    this.loadTransactionsData(this.selectedModel);
  }
  onPaginate(e: Paginate) {
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
        this.selectedModel = this.modelList[0].id;
        this.loadTransactionsData(this.selectedModel);
      })
    );
  }
  loadTransactionsData(modelId: number) {
    this.rows = [];
      this.currentCriteria.filters = [];
      let newFilter = {
        filterType: "CONDITION",
        key: "group_id",
        value: modelId,
        joinType: "NONE",
        operatorType: "EQUALS",
        dataType: "number",
      };
      this.currentCriteria.filters?.push(newFilter);
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
  ngOnDestroy(): void {
    this.subscriptions.forEach((item) => item.unsubscribe());
  }
}
