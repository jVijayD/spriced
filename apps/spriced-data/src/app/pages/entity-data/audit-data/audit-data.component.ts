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
import { SettingsService } from "../../../components/settingsPopUp/service/settings.service";
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
  headers: Header[] = [
    {
      canAutoResize: true,
      isSortable: true,
      isFilterable: true,
      column: "columnName",
      name: "Attribute",
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
    },
    {
      canAutoResize: true,
      isSortable: true,
      isFilterable: true,
      column: "priorValue",
      name: "Prior Value",
    },
    {
      canAutoResize: true,
      isSortable: true,
      isFilterable: true,
      column: "newValue",
      name: "New value",
    },
    {
      canAutoResize: true,
      isSortable: true,
      isFilterable: true,
      column: "updatedBy",
      name: "User",
    },
    {
      canAutoResize: true,
      isSortable: true,
      isFilterable: true,
      column: "transactionType",
      name: "Transaction",
    },
  ];
  columnMode: ColumnMode = ColumnMode.force;
  selectionType: SelectionType = SelectionType.single;
  sortType = SortType.single;
  selectedItem: any;
  totalElements = 0;
  rows: any[] = [];
  annotations:any[] = [];
  limit: number = 10;
  currentCriteria: Criteria = {
    filters: [],
    pager: {
      pageNumber: 0,
      pageSize: this.limit,
    },
  };
  subscriptions: any[] = [];
  defaultCodeSetting = "namecode";
  globalSettings!: any;
  title = "View Transactions for ";
  constructor(
    public dialogRef: MatDialogRef<AuditDataComponent>,
    private entityDataService: EntityDataService,
    private settings: SettingsService,
    @Inject(MAT_DIALOG_DATA) public dialogData: any
  ) {
    this.currentSelectedEntity = dialogData.currentSelectedEntity as Entity;
    dialogRef.disableClose = true;
    this.globalSettings =
      this.settings.getGlobalSettings()?.displayFormat ||
      this.defaultCodeSetting;
    switch (this.globalSettings) {
      case "namecode": {
        this.title =
          this.title +
          this.dialogData.selectedItem?.name +
          " {" +
          this.dialogData.selectedItem?.code +
          "}";
        break;
      }
      case "codename": {
        this.title =
          this.title +
          this.dialogData.selectedItem?.code +
          " {" +
          this.dialogData.selectedItem?.name +
          "}";
        break;
      }
      case "code": {
        this.title = this.title + this.dialogData.selectedItem?.code;
        break;
      }
      default: {
        this.title = this.title + " Data";
        break;
      }
    }
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
    // this.loadAuditData();
  }

  onPaginate(e: Paginate) {
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
    this.currentCriteria.filters=[];
    this.currentCriteria.filters?.push({
      filterType: "CONDITION",
      key:'id',
      value: this.selectedItem.id,
      joinType: "NONE",
      operatorType: "EQUALS",
      dataType: "number",
    });
    this.entityDataService.loadAnnotations(this.selectedItem.id,this.currentCriteria).subscribe({
      next:(res:any)=>{
        this.annotations = res.content[0].annotations.annotations;
      },
      error:(error:any)=>{
        this.annotations = [];
        console.log(error);
      }
    })
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