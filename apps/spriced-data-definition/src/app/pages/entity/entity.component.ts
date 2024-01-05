import { Component, ViewChild } from "@angular/core";
import { CommonModule } from "@angular/common";
import {
  DataGridComponent,
  DialogService,
  DialogueModule,
  FilterData,
  Header,
  HeaderActionComponent,
  HeaderComponentWrapperComponent,
  OneColComponent,
  Paginate,
  QueryColumns,
  SnackBarService,
  SnackbarModule,
} from "@spriced-frontend/spriced-ui-lib";
import { MatDialog, MatDialogModule } from "@angular/material/dialog";
import { ModelAddComponent } from "../model/components/model-add/model-add.component";
import { ColumnMode, SelectionType, SortType } from "@swimlane/ngx-datatable";
import { EntityService } from "../../services/entity.service";
import { ModelService } from "../../services/model.service";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatSelectModule } from "@angular/material/select";
import { EntityAddComponent } from "./components/entity-add/entity-add.component";
import * as moment from "moment";
import { NgxMatSelectSearchModule } from "ngx-mat-select-search";
import { ToolTipRendererDirective } from "libs/spriced-ui-lib/src/lib/components/directive/tool-tip-renderer.directive";
@Component({
  selector: "sp-entity",
  standalone: true,
  imports: [
    CommonModule,
    OneColComponent,
    DataGridComponent,
    HeaderActionComponent,
    HeaderComponentWrapperComponent,
    ModelAddComponent,
    DialogueModule,
    SnackbarModule,
    MatDialogModule,
    ReactiveFormsModule,
    FormsModule,
    MatSelectModule,
    NgxMatSelectSearchModule,
    ToolTipRendererDirective
  ],
  templateUrl: "./entity.component.html",
  styleUrls: ["./entity.component.scss"],
})
export class EntityComponent {
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
  showTooltip: any;

  @ViewChild(DataGridComponent)
  dataGrid!: DataGridComponent;
  modelList: any;
  groupId: any;
  temp: any[] = [];
  filterData: any;
  query?: any;
  filteredModelList: any;
  constructor(
    private dialogService: DialogService,
    private snackbarService: SnackBarService,
    private dialog: MatDialog,
    private entityService: EntityService,
    private modelService: ModelService
  ) {}
  ngOnInit(): void {
    this.modelService.loadAllModels().subscribe((result: any) => {
      this.modelList = result;
      this.filteredModelList = this.modelList;
      this.groupId = result[0]?.id;
      this.load({ value: this.groupId });
    });
  }
  load(id: any) {
    this.entityService.loadEntityByModel(id.value).subscribe((results: any) => {
      this.rows = results;
      this.totalElements = results.length;
      this.filterData = results;
      this.selectedItem = null;
    });
  }
  onAdd() {
    this.dataGrid.clearSelection();
    this.selectedItem = null;
    const dialogRef = this.dialog.open(EntityAddComponent, {
      data: { action: "Add", entities: this.rows, row: "" },
      //maxWidth: "300px",
      //maxHeight: "400px",
    });
    dialogRef.componentInstance.dataChange.subscribe((result: any) => {
      console.log(result);
      const entity = {
        name: result.name,
        displayName: result.displayName,
        id: result.id,
        groupId: this.groupId,
        isDisabled: false,
        autoNumberCode: result.autoNumberCode,
        attributes: result.attributes,
        enableAuditTrial: result.enableAuditTrial,
        width: result.width,
        description:result.description
      };
      this.entityService.add(entity).subscribe({
        next: (results: any) => {
          this.rows.push(results);
          this.rows = [...this.rows];
          this.totalElements = this.rows.length;
          this.snackbarService.success("Succesfully Added");
          dialogRef.close();
        },
        error: (err: any) => {
          if (err.error.errorCode == "DB_UK-008") {
            this.snackbarService.error("Entity Already Exists.");
          }
         else if (err.error.errorCode == "DB_EC-005") {
            this.snackbarService.error("Attributes with same name or display name not allowed.");
          }
           else {
            this.snackbarService.error("Entity Creation Failed.");
          }
        },
      });
    });
  }
  onRefresh() {
    this.query = null;
    this.load({ value: this.groupId });
  }
  onClear() {
    this.dataGrid.clearSelection();
    this.selectedItem = null;
  }

  filterModelsSelection(text: string) {
    this.filteredModelList = this.modelList.filter((item: any) => {
      return (
        item.displayName
          .trim()
          .toLowerCase()
          .indexOf(text.trim().toLowerCase()) != -1
      );
    });
  }

  onEdit() {
    const dialogRef = this.dialog.open(EntityAddComponent, {
      data: { action: "Edit", entities: this.rows, row: this.selectedItem },
    });
    dialogRef.componentInstance.dataChange.subscribe((result: any) => {
      console.log(result);
      const entity = {
        name: result.name,
        displayName: result.displayName,
        id: result.id,
        groupId: this.groupId,
        isDisabled: false,
        autoNumberCode: result.autoNumberCode,
        enableAuditTrial: result.enableAuditTrial,
        attributes: result.attributes,
        width: result.width,
        description:result.description
      };
      this.entityService.edit(entity).subscribe({
        next: (results: any) => {
          this.snackbarService.success('Succesfully Updated');
          dialogRef.close();
          this.load({ value: this.groupId });
        },
        error: (err: any) => {
          if (err.error.errorCode == "DB_UK-008") {
            this.snackbarService.error("Entity Already Exists.");
          }
         else if (err.error.errorCode == "DB_EC-005") {
            this.snackbarService.error("Attributes with same name or display name not allowed.");
          }
           else {
            this.snackbarService.error("Entity Updation Failed.");
          }
        },
      });
    });
  }
  onDelete() {
    const dialogRef = this.dialogService.openConfirmDialoge({
      message: "Do you want to delete?",
      title: "Delete Entity",
      icon: "delete",
    });
    dialogRef.afterClosed().subscribe((result: any) => {
      if (result == true) {
        this.entityService.delete(this.selectedItem.id).subscribe({
          next: (results: any) => {
            this.snackbarService.success("Succesfully Deleted");
            this.load({ value: this.groupId });
            this.dataGrid.clearSelection();
          },
          error: (err: any) => {
            this.snackbarService.error("Entity Deletion Failed.");
          },
        });
      }
    });
  }
  onPaginate(e: Paginate) {
    //this.rows = this.getData(e.limit, e.offset);
  }

  onItemSelected(e: any) {
    console.log(e);
    this.selectedItem = e;
  }

  onSort(e: any) {
    console.log(e);
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
        console.log(val);
        val.map((item: any, index: number) => {
          this.filterRows(item);
        });

        const result: any = [...new Set(this.rows)];
        this.rows = result;
      }
    });
  }

  public filterRows(item: any)
  {
    if(!!item.operatorType)
    {
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

    if(!!item.filters)
    {
      item.filters.map((el: any) => {
        this.filterRows(el);
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
    this.load({ value: this.groupId });
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
