import { Component, Inject, OnInit, ViewChild } from "@angular/core";

import { QueryBuilderConfig, QueryBuilderComponent } from "ngx-angular-query-builder";
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from "@angular/material/dialog";
import { FormGroup, FormBuilder } from "@angular/forms";
import { DataEntityService, unixTimeStamp } from "@spriced-frontend/spriced-common-lib";
import { LookupDialogComponent } from "../../dynamic-form/sub-components/lookup-select/lookup-dialog/lookup-dialog/lookup-dialog.component";
import * as moment from "moment";
@Component({
  selector: "sp-filter",
  templateUrl: "./filter-dialog.component.html",
  styleUrls: ["./filter-dialog.component.scss"],
})
export class FilterDialogComponent implements OnInit {
  @ViewChild('queryBuilder') public queryBuilder!: QueryBuilderComponent;
  form!: FormGroup;
  config!: QueryBuilderConfig;
  currentFilteredItems: any = [];
  displayProp: any;
  dialogReference: any = null;
  maxCount: number = 50;
  count!: number;
  pageSize: number = 50;
  source: any;
  status: any[] = [
    {
      name: 'Validation succeeded',
      value: 'true'
    },
    {
      name: 'Validation failed',
      value: 'false'
    }
  ];
  initialQuery: any;
  edited=false;

  constructor(
    private dialog: MatDialog,
    public fb: FormBuilder,
    private entityService: DataEntityService,
    public dialogRef: MatDialogRef<FilterDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: FilterData
  ) {
    this.displayProp =
      data.displayFormat === "code"
        ? "code"
        : data.displayFormat === "codename"
          ? "code|name"
          : "name|code";
    data.query =
      data && data.query
        ? data.query
        : {
          condition: "and",
          rules: [],
        };
        data.columns?.forEach((itm: any, i: number) => {
          if (itm.name === "code") {
            data.columns?.splice(i, 1);
            data.columns?.unshift(itm);
          }
        });
    this.config =
      data && data.config ? data.config : this.createConfig(data.columns || [])

    if (data.query.rules.length > 0) {
      this.addLookupData(data.query.rules);
    }

    this.form = this.fb.group({
      query: [data.query]
    })
    this.initialQuery=JSON.parse(JSON.stringify(data.query))
    dialogRef.disableClose = true;

    //HANDLE THIS FUNCTION FOR REMOVE THE INPUT FIELD DEPENDS UPON THE OPERATOR TYPE
    QueryBuilderComponent.prototype.getInputType = function (field, operator) {
      if (this.config.getInputType) {
        return this.config.getInputType(field, operator);
      }
      if (!this.config.fields[field]) {
        return null; //MY CODE
        // throw new Error("No configuration for field '" + field + "' could be found! Please add it to config.fields."); // EXISTING CODE
      }
      var type = this.config.fields[field].type;
      switch (operator) {
        case 'Is not NULL':
          return null; // No displayed component
        case 'Is NULL':
          return null; // No displayed component
        default:
          return type;
      }
    };
  }

  ngOnInit(): void {
    this.form.valueChanges
      .subscribe(() => {
      this.edited= this.compareValues(this.initialQuery,this.form.value.query)
      });
}

compareValues(a:any,b:any)
{
 return JSON.stringify(a)!==JSON.stringify(b)
}


  // HANDLE FOR ADDING FILTER FILTERED ITEMS TO EVERY RULE 
  handleAddRule(ruleset: any, addRule: Function) {
    if (!!addRule) {
      addRule();
    }
    ruleset.rules.map((item: any) => item.filteredItems = this.queryBuilder.fields);
  }
  onCancel(): void {
    this.dialogRef.close(null);
  }
  onApply(event:any): void {
    const filterGroup:any = this.convertToFilters(this.form.value.query);
    filterGroup['button'] = event
    this.dialogRef.close(filterGroup);
  }

  // HANDLE THIS FUNCTION FOR CHANGING THE OPERATOR AND SET VALIDATORS DEPENDS UPON THE OPERATOR
  handleOperators(value: any, rule: any, onChange?: any) {
    rule.operator = value;
    console.log(this.config, this.form, this.queryBuilder);
    if (!!onChange) {
      onChange(rule, rule?.value || '');
    }
  }

  getDefaultValue(
    dataType: "string" | "number" | "date" | "boolean" | "category" = "string"
  ): string | number | Date | boolean {
    switch (dataType) {
      case "string":
        return "";
      case "number":
        return 0;
      case "date":
        return new Date();
      case "boolean":
        return false;
      default:
        return "";
    }
  }

  // HANDLE THIS FUNCTION FOR WHEN WE EDIT THE FILTER THEN FETCH LOOKUPDATA
  public addLookupData(item: any) {
    item.forEach((elm: any) => {
      if (elm.rules && elm.rules.length > 0) {
        this.addLookupData(elm.rules);
      }
      else {
        this.handleLookupData(elm.field);
      }
    });
  }

  public convertToFilters(query: any) {
    let filters: Filter[] = [];
    let parentCondition = query.parentCondition ? query.parentCondition : query.condition
    query.rules.forEach((item: any, index: number) => {
      const operatorType = this.getOperatorType(item.operator);
      const dataTypeType = this.getDataType(this.data.columns, item.field);

      const groupFilters = item.rules
        ? this.convertToFilters({
          rules: item.rules,
          condition: item.condition,
          parentCondition: query.condition
        })
        : undefined;
      const conditionType = !!item.condition ? item.condition : query.condition;
      const filter: Filter = {
        filterType: item.rules
          ? FilterType.CONDITIONGROUP
          : FilterType.CONDITION,
        joinType: item.rules ? this.getJoinType(parentCondition): this.getJoinType(conditionType),
        operatorType: operatorType,
        key: item.field,
        value: item.value ? item.value : this.getDefaultValue(dataTypeType),
        filters: groupFilters,
        dataType: dataTypeType,
      };
      filters.push(filter);
    });
    
    return filters;
  }

  private getJoinType(condition: string) {
    if (condition == "and") {
      return JoinType.AND;
    } else if (condition == "or") {
      return JoinType.OR;
    } else {
      return JoinType.AND;
    }
  }

  private getDataType(
    columns: QueryColumns[] | undefined,
    name: string
  ): "string" | "number" | "date" | "boolean" | "category" {
    let dataType: "string" | "number" | "date" | "boolean" | "category" =
      "string";
    const col = columns?.find((item) => item.name === name);
    dataType = col?.dataType && col?.formType !== 'LOOKUP' ? col?.dataType : "string";
    dataType = dataType === "category" ? "boolean" : dataType;
    return dataType;
  }

  private getOperatorType(operator: string) {
    let operatorType: OperatorType | undefined = undefined;
    switch (operator) {
      case "Is equal to":
        return OperatorType.EQUALS;
      case "Is not equal to":
        return OperatorType.IS_NOT_EQUAL;
      case "Is greater than":
        return OperatorType.GREATER_THAN;
      case "Is greater than or equal to":
        return OperatorType.GREATER_THAN_EQUALS;
      case "Is less than":
        return OperatorType.LESS_THAN;
      case "Is less than or equal to":
        return OperatorType.LESS_THAN_EQUALS;
      case "Contains pattern":
        return OperatorType.CONTAINS;
      case "Does not contain pattern":
        return OperatorType.NOT_CONTAINS;
      case "Is NULL":
        return OperatorType.IS_NULL;
      case "Is not NULL":
        return OperatorType.IS_NOT_NULL;
      case "Starts with":
        return OperatorType.STARTS_WITH;
      case "Ends with":
        return OperatorType.ENDS_WITH;
      //case "IN":
      //return OperatorType.IN;
      // case "starts with":
      //   return OperatorType.ILIKE;
      // case "ends with":
      //   return OperatorType.ILIKE;
    }
    return operatorType;
  }

  private createConfig(columns: QueryColumns[]) {
    let config: QueryBuilderConfig = {
      fields: {},
    };
    columns.forEach((col) => {
      // debugger;
      const dataType = col.formType === 'LOOKUP' ? col.formType : col.dataType;
      config.fields[col.name] = {
        name: col.displayName || col.name,
        type: dataType,
        operators: this.mapOperators(dataType),
        entity: col.referencedTableId,
        options: col.options,
        nullable: col.nullable,
        validator: (rule) => {
          if (['', null, undefined].includes(rule.value) && ![undefined, 'Is NULL', 'Is not NULL'].includes(rule.operator)) {
            return {
              required: {
                rule: rule,
                message: 'Field is required'
              }
            }
          }
          return null;
        }
      };
    });
    return config;
  }

  public handleLookupData(item: any, rule?: any) {
    rule ? (rule.valueName = '', rule.selectedItem = '') : null;
    let field: any = this.config.fields[item];
    if(field?.options)
  {   
     field.filteredOptions=field.options
  }    
if (item === "is_valid") {
      field.filteredOptions = this.status;
    }
    if (field?.type === 'LOOKUP' && !!field?.entity) {
      this.loadLookupData(field.entity, 0, [], item);
    }
  }

  loadLookupData(id: string | number, pageNumber: number, filters: any, rule?: any) {
    this.entityService.loadLookupData(id, pageNumber, this.pageSize, filters).subscribe((res: any) => {
      if (rule) {
        let field: any = this.config.fields[rule];
        field.options = res?.content;
        field.filteredOptions = res.content;
        field.count = res?.totalElements;
      }
      else {
        this.dialogReference.componentInstance.upDatedData({
          value: res?.content,
          total: res?.totalElements,
        });
      }
    })
  }

  openPopup(rule: any, onChange?: any): void {
    let field: any = this.config.fields[rule.field];
    const dialogRef = this.dialog.open(LookupDialogComponent, {
      width: "700px",
      height: "620px",
      data: {
        value: field.options,
        total: field.count,
        pageSize: this.pageSize,
        selectedItem: rule.selectedItem,
        lookupId:field.entity
      },
      hasBackdrop: false,
    });
    this.dialogReference = dialogRef;
    dialogRef.afterClosed().subscribe((result: any) => {
      if (result && result.data) {
        const { data } = result;
        rule.selectedItem = data;
        rule.value = data.code;
        rule.valueName = this.getDisplayProp(data);
        if (!!onChange) {
          onChange(data.code, rule);
        }
      }
    });
    dialogRef.componentInstance.dialogEvent$.subscribe((event: any) => {
      this.loadLookupData(field.entity, event.pageNumber, event.filters);
    });
  }
  public handleSerch(value: any, item: any, text?: string) {
    if (text === 'fieldSearch') {
      console.log(this.config, this.data.columns);
      const items: any = this.queryBuilder.fields;
      const final = this.filterItems(items, value);
      item.filteredItems = final;
    }
    else {
      let field: any = this.config.fields[item.field];
      field.filteredOptions = this.filterItems(field.options, value);
    }
  }
  // Generic filtering function
  private filterItems(items: any[], searchText: string): any[] {

    if (searchText === '') {
      return items;
    }
    return items.filter((item: any) => {
      // Check if either code or name includes the searchText
      return (
        (item.code && item.code.toString().toLowerCase().includes(searchText.trim().toLowerCase())) ||
        (item.name &&
          item.name.trim().toLowerCase().includes(searchText.trim().toLowerCase()))
      );
    });
  }

  public getDisplayProp(option: any) {
    const prop = this.displayProp?.split("|") || [];
    return prop.reduce((prev: any, cur: any) => {
      return prev === "-##"
        ? option[cur]
        : `${prev == null ? "" : prev} ${this.renderDataWithCurlyBrace(
          option[cur]
        )}`;
    }, "-##");
  }

  private renderDataWithCurlyBrace(data: any) {
    return data == null ? "" : "{" + data + "}";
  }

  private mapOperators(type: string) {
    switch (type) {
      case "string":
        return [
          "Is equal to",
          "Is not equal to",
          "Is greater than",
          "Is less than",
          "Is greater than or equal to",
          "Is less than or equal to",
          "Contains pattern",
          "Does not contain pattern",
          "Is NULL",
          "Is not NULL",
          // "Starts with",
          // "Ends with",
        ];
      case "date":
        return [
          "Is equal to",
          "Is not equal to",
          "Is greater than",
          "Is less than",
          "Is greater than or equal to",
          "Is less than or equal to",
          "Is NULL",
          "Is not NULL",
          // "IN",
        ];
      case "number":
        return [
          "Is equal to",
          "Is not equal to",
          "Is greater than",
          "Is less than",
          "Is greater than or equal to",
          "Is less than or equal to",
          "Is NULL",
          "Is not NULL",
        ];
      case "boolean":
        return ["Is equal to", "Is not equal to"];

      case "LOOKUP":
        return [
          "Is equal to",
          "Is not equal to",
          "Is NULL",
          "Is not NULL",
        ];
    }
    return [];
  }
  public changeTimeStamp(date: any)
  {
    let timezone = (localStorage.getItem("timezone") as string) || "null";
    if (timezone !== "null") {
    return moment(date as string).tz(timezone);
    } else {
      return unixTimeStamp(date);
    }
  }
}
export interface FilterData {
  config: QueryBuilderConfig | null;
  query?: any | null;
  disabled?: boolean;
  persistValueOnFieldChange?: boolean;
  columns?: QueryColumns[];
  emptyMessage?: string;
  displayFormat?: string;
  save?:boolean;
  edit?:boolean;
  filterName?:string;
}

// export interface FilterGroup {
//   filterType: FilterType;
//   joinType: JoinType;
//   filters: Filter[];
// }

interface Filter {
  filterType: string;
  key?: string;
  value?: number | string | boolean;
  joinType: JoinType;
  operatorType?: OperatorType;
  filters?: Filter[];
  dataType: "number" | "string" | "date" | "boolean" | "category";
}

enum FilterType {
  CONDITION = "CONDITION",
  CONDITIONGROUP = "CONDITIONGROUP",
}

enum JoinType {
  NONE = "NONE",
  OR = "OR",
  NOT = "NOT",
  AND = "AND",
}

enum OperatorType {
  EQUALS = "EQUALS",
  IS_NOT_EQUAL = "IS_NOT_EQUAL",
  LIKE = "LIKE",
  IS_NOT_LIKE = " IS_NOT_LIKE",
  GREATER_THAN = "GREATER_THAN",
  LESS_THAN = "LESS_THAN",
  GREATER_THAN_EQUALS = "GREATER_THAN_EQUALS",
  LESS_THAN_EQUALS = "LESS_THAN_EQUALS",
  CONTAINS = "CONTAINS",
  NOT_CONTAINS = "NOT_CONTAINS",
  IS_NULL = "IS_NULL",
  IS_NOT_NULL = "IS_NOT_NULL",
  STARTS_WITH = "STARTS_WITH",
  ENDS_WITH = "ENDS_WITH",
  IN = "IN",
  //ILIKE = "ILIKE",
}

export interface QueryColumns {
  name: string;
  displayName?: string;
  formType?: any;
  dataType: "number" | "string" | "date" | "boolean" | "category";
  options?: { name: string; value: any }[];
  nullable?: boolean;
  referencedTableId?: any;
}
