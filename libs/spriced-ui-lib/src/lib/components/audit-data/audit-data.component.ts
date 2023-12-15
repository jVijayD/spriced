import { Component, ElementRef, Inject, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { CommonModule } from "@angular/common";
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from "@angular/material/dialog";
import { MatIconModule } from "@angular/material/icon";
import { FormGroup } from "@angular/forms";
import { Criteria, Entity } from "@spriced-frontend/spriced-common-lib";
import { ColumnMode, SelectionType, SortType } from "@swimlane/ngx-datatable";
import { DataEntityService } from "@spriced-frontend/spriced-common-lib";
import * as moment from "moment";
import {
  MatFormField,
  MatFormFieldModule,
  MatLabel,
} from "@angular/material/form-field";
import { MatButtonModule } from "@angular/material/button";
import { MatInputModule } from "@angular/material/input";
import { GlobalSettingService } from "./../settting-popup/global-setting.service";
import { KeycloakService } from "keycloak-angular";
import { DynamicFormModule } from "../dynamic-form/dynamic-form.module";
import { DataGridComponent, Header, Paginate } from "../data-grid/data-grid.component";
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
    DataEntityService,
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
      sortColumn:"column_name",

    },
    {
      canAutoResize: true,
      isSortable: true,
      isFilterable: true,
      column: "updatedDate",
      name: "Last Updated On",
      pipe: (data: any) => {
        return moment(data).format("MM/DD/YYYY");
      },
      sortColumn:"updated_date",
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
  @ViewChild('inputField') inputField!:ElementRef;
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
    sorters:[{direction:"DESC",property:"updated_date"}]
  };
  subscriptions: any[] = [];
  defaultCodeSetting = "namecode";
  globalSettings!: any;
  title = "View Transactions for ";
  name:string=''
  constructor(
    public dialogRef: MatDialogRef<AuditDataComponent>,
    private entityDataService: DataEntityService,
    private settings: GlobalSettingService,
    private keycloak: KeycloakService,
    @Inject(MAT_DIALOG_DATA) public dialogData: any
  ) {
    this.currentSelectedEntity = dialogData.currentSelectedEntity as Entity;
    dialogRef.disableClose = true;
    this.globalSettings =
      this.settings.getGlobalSettings()?.displayFormat ||
      this.defaultCodeSetting;
      if(this.dialogData.selectedItem.name == undefined || this.dialogData.selectedItem.name == null)
      {
      this.name=' '
      }
      else{
      this.name=this.dialogData.selectedItem.name
      }
    switch (this.globalSettings) {
      case "namecode": {
        this.title =
          this.title +
          this.name  +
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
          this.name +
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
    const filters = this.createFilters("entity_name",this.currentSelectedEntity.name,"string");
    this.currentCriteria.filters?.push(...filters);
  }

  onPaginate(e: Paginate) {
    this.currentCriteria.filters=[];
    const filters = this.createFilters("entity_name",this.currentSelectedEntity.name,"string");
    this.currentCriteria.filters?.push(...filters);
    this.currentCriteria={
      ...this.currentCriteria,
      pager: {
        pageNumber: e.offset,
        pageSize: this.limit,
      },
    }
    this.loadAuditData();
  }

  onItemSelected(e: any) {
    this.selectedItem = e;
    const filters:Criteria =  {
      filters: [{
        filterType: "CONDITION",
        key:"entity_name",
        value:this.currentSelectedEntity.name,
        joinType: "NONE",
        operatorType: "EQUALS",
        dataType:"string",
      },],
      pager: {pageNumber:0,pageSize:10000},
      sorters:[{direction:"DESC",property:"updated_date"}]
    };
    this.entityDataService.loadAnnotations(this.selectedItem.id,filters).subscribe({
      next:(res:any)=>{
      const result = res.content.find((item:any)=>item.id===this.selectedItem.id);
      this.annotations = result?.annotations.annotations || [];
      },
      error:(error:any)=>{
        this.annotations = [];
        console.log(error);
      }
    })
  }

  onSort(e: any) {
    this.currentCriteria.filters=[];
    const filters = this.createFilters("entity_name",this.currentSelectedEntity.name,"string");
    this.currentCriteria.filters?.push(...filters);
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

  createFilters(key:string,value:any,dataType:string){
    return [
      {
      filterType: "CONDITION",
      key:key,
      value:value,
      joinType: "NONE",
      operatorType: "EQUALS",
      dataType:dataType,
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
      "key": "record_id",
      "value":  this.dialogData.selectedItem?.id,
      "joinType": "AND",
      "operatorType": "EQUALS",
      "dataType": "number"
  }]
  }  

  onClose(): void {
    this.dialogRef.close(null);
  }
  onAdd(value: any) {
    let user = this.keycloak.getKeycloakInstance();
    let newAnnotation=
      {
        "userid": user?.profile?.email || this.selectedItem.id,
        "comment": value,
        "code":this.dialogData.selectedItem.code
    }
    this.annotations.push(newAnnotation)
    this.entityDataService.addAnnotations(this.selectedItem.id,this.annotations).subscribe({
      next:(res:any)=>{
        this.onItemSelected(this.selectedItem)
        this.inputField.nativeElement.value = '';
      },
      error:(error:any)=>{
        console.log(error);
      }
    })
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