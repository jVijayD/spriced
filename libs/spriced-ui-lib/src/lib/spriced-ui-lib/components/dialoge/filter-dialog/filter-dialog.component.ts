import { Component, Inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import {
  NgxAngularQueryBuilderModule,
  QueryBuilderConfig,
} from "ngx-angular-query-builder";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatRadioModule } from "@angular/material/radio";

@Component({
  selector: "sp-filter",
  templateUrl: "./filter-dialog.component.html",
  styleUrls: ["./filter-dialog.component.scss"],
})
export class FilterDialogComponent {
  config!: QueryBuilderConfig;
  constructor(
    public dialogRef: MatDialogRef<FilterDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: FilterData
  ) {
    data.query =
      data && data.query
        ? data.query
        : {
            condition: "and",
            rules: [],
          };
    this.config =
      data && data.config ? data.config : this.createConfig(data.columns || []);

    dialogRef.disableClose = true;
  }
  onCancel(): void {
    this.dialogRef.close(null);
  }
  onApply(): void {
    const filterGroup = this.convertToFilters(this.data.query);
    this.dialogRef.close(filterGroup);
  }

  private convertToFilters(query: any) {
    let filters: Filter[] = [];

    query.rules.forEach((item: any, index: number) => {
      const operatorType = this.getOperatorType(item.operator);

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
        value: item.value,
        filters: groupFilters,
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

  private getOperatorType(operator: string) {
    let operatorType: OperatorType | undefined = undefined;
    switch (operator) {
      case "=":
      case "equals":
        return OperatorType.EQUALS;
      case "!=":
      case "not equal to":
        return OperatorType.IS_NOT_EQUAL;
      case ">":
        return OperatorType.GREATER_THAN;
      case ">=":
        return OperatorType.GREATER_THAN_EQUALS;
      case "<":
        return OperatorType.LESS_THAN;
      case "<=":
        return OperatorType.LESS_THAN_EQUALS;
      case "contains":
        return OperatorType.LIKE;
      case "starts with":
        return OperatorType.ILIKE;
      case "ends with":
        return OperatorType.ILIKE;
    }
    return operatorType;
  }

  private createConfig(columns: QueryColumns[]) {
    let config: QueryBuilderConfig = {
      fields: {},
    };
    columns.forEach((col) => {
      config.fields[col.name] = {
        name: col.displayName || col.name,
        type: col.dataType,
        operators: this.mapOperators(col.dataType),
        options: col.options,
        nullable: col.nullable,
      };
    });
    return config;
  }

  private mapOperators(type: string) {
    switch (type) {
      case "string":
        return [
          "equals",
          "contains",
          "starts with",
          "ends with",
          "not equal to",
        ];
      case "date":
        return [">", "<", ">=", "<=", "=", "!="];
      case "number":
        return [">", "<", ">=", "<=", "=", "!="];
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
  IN = "IN",
  ILIKE = "ILIKE",
  LIKE = "LIKE",
  IS_NOT_EQUAL = "IS_NOT_EQUAL",
  GREATER_THAN = "GREATER_THAN",
  GREATER_THAN_EQUALS = "GREATER_THAN_EQUALS",
  LESS_THAN = "LESS_THAN",
  LESS_THAN_EQUALS = "LESS_THAN_EQUALS",
}

export interface QueryColumns {
  name: string;
  displayName?: string;
  dataType: "number" | "string" | "date" | "category";
  options?: { name: string; value: any }[];
  nullable?: boolean;
}
