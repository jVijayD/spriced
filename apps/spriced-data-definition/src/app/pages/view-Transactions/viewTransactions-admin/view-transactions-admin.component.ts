import { Component, Inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import { DataGridComponent, Header, HeaderActionComponent, HeaderComponentWrapperComponent, Paginate } from "@spriced-frontend/spriced-ui-lib";
import { ColumnMode, Model, SelectionType, SortType } from "@swimlane/ngx-datatable";
import * as moment from "moment";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatTabsModule } from "@angular/material/tabs";
import { MatTableModule } from "@angular/material/table";
import { MatSelectChange, MatSelectModule } from "@angular/material/select";
import { MatInputModule } from "@angular/material/input";
import { MatIconModule } from "@angular/material/icon";
import { ToolTipRendererDirective } from "libs/spriced-ui-lib/src/lib/components/directive/tool-tip-renderer.directive";
import { TransactionsService } from "./service/transactions.service";
import { Criteria,} from "@spriced-frontend/spriced-common-lib";
import { MAT_DIALOG_DATA } from "@angular/material/dialog";
import { ModelService } from "../../../services/model.service";
@Component({
  selector: "sp-view-transactions-admin",
  standalone: true,
  imports: [CommonModule,
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
  selectedItem:any;
  selectedModel: any;
  sortType = SortType.single;
  columnMode: ColumnMode = ColumnMode.force;
  selectionType: SelectionType = SelectionType.single;
  totalElements = 0;
  rows: any[] = [];
  limit: number = 10;
  modelList!:any[];
  query?: any;
  currentCriteria!: Criteria;
  subscriptions :any[]= [];
  constructor(
    private modelService:ModelService
    ){
  }
  headers: Header[] = [
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
    debugger
    this.selectedModel = ev.value;
  }
  onPaginate(e: Paginate) {
  }

  onItemSelected(e: any) {
    console.log(e);
    this.selectedItem = e;
  }

  onSort(e: any) {
    console.log(e);
  }

  ngOnInit() {
    this.subscriptions.push(
      this.modelService.loadAllModels().subscribe((result: any) => {
        debugger
        this.modelList = result;
        this.selectedModel = this.modelList[0].id;
      })
    );
  }
}
