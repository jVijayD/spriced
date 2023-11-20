import { Attribute, ChangeDetectorRef, Component, ElementRef, Inject, ViewChild } from "@angular/core";

import { QueryBuilderConfig } from "ngx-angular-query-builder";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { FormGroup, FormBuilder } from "@angular/forms";
import { DataEntityService } from "@spriced-frontend/spriced-common-lib";
import { debounceTime } from "rxjs";

@Component({
  selector: "sp-filter",
  templateUrl: "./filter-dialog.component.html",
  styleUrls: ["./filter-dialog.component.scss"],
})
export class FilterDialogComponent {
  form!: FormGroup
  config!: QueryBuilderConfig;
  currentFilteredItems: any = [];
  displayProp: any;
  constructor(
    public fb: FormBuilder,
    private entityService: DataEntityService,
    private cdk: ChangeDetectorRef,
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
    this.config =
      data && data.config ? data.config : this.createConfig(data.columns || []);

    this.form = this.fb.group({
      query: [data.query],
      itemFiltered: [''],
      fieldName: ['']
    })
    dialogRef.disableClose = true;
  }
  onCancel(): void {
    this.dialogRef.close(null);
  }
  onApply(): void {
    const filterGroup = this.convertToFilters(this.form.value.query);
    this.dialogRef.close(filterGroup);
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
  private convertToFilters(query: any) {
    let filters: Filter[] = [];
    //debugger;
    query.rules.forEach((item: any, index: number) => {
      const check = item.field.indexOf(',');
      const field = check !== -1 ? item.field.split(',') : item;
      if (field.length > 1) {
        item.field = field.find((el: any) => el.endsWith('_code'));
      }
      const operatorType = this.getOperatorType(item.operator);
      const dataTypeType = this.getDataType(this.data.columns, item.field);

      const groupFilters = item.rules
        ? this.convertToFilters({
          rules: item.rules,
          condition: item.condition,
        })
        : undefined;
      const filter: Filter = {
        filterType: item.rules
          ? FilterType.CONDITIONGROUP
          : FilterType.CONDITION,
        joinType: index == 0 ? JoinType.NONE : this.getJoinType(item.condition),
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
    dataType = col?.dataType || "string";
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
      config.fields[col.name] = {
        name: col.displayName || col.name,
        type: col.formType === 'LOOKUP' ? col.formType : col.dataType,
        operators: this.mapOperators(col.dataType),
        entity: col.referencedTableId,
        options: col.options,
        nullable: col.nullable,
        validator: (rule) => {
          if (['', null, undefined].includes(rule.value)) {
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

  public handleLookupData(rule: any) {
    let field: any = this.config.fields[rule];
    if (field?.type === 'LOOKUP' && !!field?.entity && !field?.options) {
      this.entityService.loadLookupData(field.entity, 0, 20000, []).subscribe((res: any) => {
        field.options = res.content;
        field.filteredOptions = res.content;
      })
    }
  }

  public handleSerch(value: any, item: any) {
    let field: any = this.config.fields[item.field];
    field.filteredOptions = this.filterItems(field.options, value);
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
          // "Is greater than",
          // "Is less than",
          // "Is greater than or equal to",
          // "Is less than or equal to",
          // "Contains pattern",
          // "Does not contain pattern",
          "Is NULL",
          "Is not NULL",
          // "Starts with",
          // "Ends with",
        ];
      case "date":
        return [
          "Is equal to",
          "Is not equal to",
          // "Is greater than",
          // "Is less than",
          // "Is greater than or equal to",
          // "Is less than or equal to",
          "Is NULL",
          "Is not NULL",
          // "IN",
        ];
      case "number":
        return [
          "Is equal to",
          "Is not equal to",
          // "Is greater than",
          // "Is less than",
          // "Is greater than or equal to",
          // "Is less than or equal to",
        ];
      case "boolean":
        return ["Is equal to", "Is not equal to"];
    }
    return [];
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
