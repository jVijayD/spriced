import { Component, Inject, OnDestroy, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from "@angular/material/dialog";
import {
  DynamicFormModule,
  DataGridComponent,
  Header,
  Paginate,
  DynamicFormService,
} from "@spriced-frontend/spriced-ui-lib";
import { MatIconModule } from "@angular/material/icon";
import { FormGroup } from "@angular/forms";
import { Criteria, Entity } from "@spriced-frontend/spriced-common-lib";
import { ColumnMode, SelectionType, SortType } from "@swimlane/ngx-datatable";
import { EntityDataService } from "../../../services/entity-data.service";
import * as moment from "moment";
import {
  MatFormField,
  MatFormFieldModule,
  MatLabel,
} from "@angular/material/form-field";
import { MatButtonModule } from "@angular/material/button";
import { MatInputModule } from "@angular/material/input";
// import { SettingsService } from "../../../components/settingsPopUp/service/settings.service";

@Component({
  selector: "sp-add-model",
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    DynamicFormModule,
    MatIconModule,
    DataGridComponent,
    MatFormFieldModule,
    MatButtonModule,
    MatInputModule,
  ],
  providers: [
    EntityDataService,
    // SettingsService,
    // DynamicFormService,
  ],
  templateUrl: "./audit-data.component.html",
  styleUrls: ["./audit-data.component.scss"],
})
export class AuditDataComponent implements OnInit, OnDestroy {
  currentSelectedEntity: Entity;
  /*

*/
  annotations: any[] = [
    {
      name: "team1",
      message: "changes by team 1",
    },
    {
      name: "team2",
      message: "changes by team 1",
    },
    {
      name: "team3",
      message: "changes by team 1",
    },
  ];
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
  columnMode: ColumnMode = ColumnMode.force;
  selectionType: SelectionType = SelectionType.single;
  sortType = SortType.single;
  selectedItem: any;
  totalElements = 0;
  rows: any[] = [];
  limit: number = 10;
  currentCriteria: Criteria = {
    filters: [],
    pager: {
      pageNumber: 0,
      pageSize: this.limit,
    },
  };
  subscriptions: any[] = [];

  constructor(
    public dialogRef: MatDialogRef<AuditDataComponent>,
    private entityDataService: EntityDataService,
    @Inject(MAT_DIALOG_DATA) public dialogData: any
  ) {
    this.currentSelectedEntity = dialogData as Entity;
    dialogRef.disableClose = true;
  }
  ngOnInit(): void {
    this.currentCriteria.filters?.push({
      filterType: "CONDITION",
      key: "entity_name",
      value: this.currentSelectedEntity.name,
      joinType: "NONE",
      operatorType: "EQUALS",
      dataType: "string",
    });
    this.loadAuditData();
  }

  onPaginate(e: Paginate) {
    debugger;
    this.currentCriteria = {
      ...this.currentCriteria,
      pager: {
        pageNumber: e.offset,
        pageSize: this.limit,
      },
    };
    this.loadAuditData();
  }

  onItemSelected(e: any) {
    this.selectedItem = e;
  }

  onSort(e: any) {
    const sorters = e.sorts.map((sort: any) => {
      return { direction: sort.dir.toUpperCase(), property: sort.prop };
    });
    this.currentCriteria = { ...this.currentCriteria, sorters: sorters };
    this.loadAuditData();
  }
  loadAuditData() {
    this.subscriptions.push(
      this.entityDataService
        .loadAuditData(this.currentSelectedEntity.name, this.currentCriteria)
        .subscribe({
          next: (page: any) => {
            this.rows = page.content;
            this.totalElements = page.totalElements;
            this.onItemSelected(this.rows[0]);
          },
          error: (err: any) => {
            this.rows = [];
            console.error(err);
          },
        })
    );
  }

  onClose(): void {
    this.dialogRef.close(null);
  }
  onAdd(value: any) {
    debugger;
  }
  onSubmit(data: FormGroup<any>) {
    if (data.valid) {
      this.dialogRef.close(data.value);
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((item) => item.unsubscribe());
  }
}
