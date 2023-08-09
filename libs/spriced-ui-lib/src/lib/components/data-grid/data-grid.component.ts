import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
  PipeTransform,
  ViewChild,
} from "@angular/core";
import { CommonModule } from "@angular/common";
import {
  ColumnMode,
  DatatableComponent,
  NgxDatatableModule,
  SelectionType,
  SortType,
} from "@swimlane/ngx-datatable";
import { CustomToolTipComponent } from "../custom-tool-tip/custom-tool-tip.component";
import { ToolTipRendererDirective } from "../directive/tool-tip-renderer.directive";
import * as moment from "moment";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

@Component({
  selector: "sp-data-grid",
  standalone: true,
  imports: [
    CommonModule,
    NgxDatatableModule,
    CustomToolTipComponent,
    ToolTipRendererDirective,
    MatCheckboxModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  templateUrl: "./data-grid.component.html",
  styleUrls: ["./data-grid.component.scss"],
  //changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DataGridComponent implements AfterViewInit {
  @ViewChild(DatatableComponent)
  table!: DatatableComponent;
  loading: boolean = false;

  @Input()
  title = "";

  @Input()
  attributes: any;

  @Input()
  headerHeight = 40;

  @Input()
  footerHeight = 50;

  @Input()
  rows: any[] = [];

  @Input()
  headers: Header[] = [];

  @Input()
  isArray = true;

  @Input()
  enableRowIndex = true;

  @Input()
  rowHeight: number | "auto" = "auto";

  @Input()
  columnMode: ColumnMode = ColumnMode.standard;

  @Input()
  selectionType!: SelectionType;

  @Input()
  offset = 0;

  @Input()
  sortType!: SortType;

  @Input()
  virtualScroll!: boolean;

  @Input()
  isExternalPaging!: boolean;

  @Input()
  isExternalSorting!: boolean;

  @Input()
  limit!: number;

  @Input()
  count!: number;

  @Output()
  itemSelected: EventEmitter<any> = new EventEmitter<any>();

  @Output()
  paginate: EventEmitter<Paginate> = new EventEmitter<Paginate>();

  @Output()
  expression: EventEmitter<any> = new EventEmitter<any>();

  @Output()
  updateExcluded: EventEmitter<any> = new EventEmitter<any>();

  @Output()
  sort: EventEmitter<any> = new EventEmitter<any>();

  onPaginate(e: Paginate) {
    this.paginate.emit(e);
  }

  onSelect(e: any) {
    this.itemSelected.emit(e.selected ? e.selected[0] : null);
  }

  onSort(e: any) {
    this.sort.emit(e);
  }

  public clearSorting() {
    this.table.sorts = [];
  }

  public clearSelection() {
    this.table.selected = [];
  }

  /**
   * HANDLE THIS FUNCTION FOR EXPRESSION TOOLTIP
   * @param element any
   * @returns
   */
  getExpressionTooltip(element: any): string {
    let tooltipText = `${this.getConditionTooltipText(element.condition, 3)}`;
    tooltipText += this.getActionTooltipText(element.conditionalAction);

    return tooltipText;
  }

  /**
   * HANDLE THIS FUNCTION FOR HIERARCHICAL ADD CONDITIONS
   * @param conditions any
   * @param depth number
   * @returns
   */
  private getConditionTooltipText(conditions: any[], depth: number): string {
    let tooltipConditionText = `<b>IF</b><br>`;
    tooltipConditionText += this.getIndent(depth);
    let operand: any = "";

    if (conditions && conditions.length > 0) {
      conditions.forEach((condition: any, index: number) => {
        tooltipConditionText += index !== 0 ? this.getIndent(3) : "";
        const attribute = this.attributes.find(
          (item: any) => item.id === condition.attributeId
        );
        const conditionType =
          condition?.conditionType !== "NONE" ? condition?.conditionType : "";
        const subConditionType =
          condition?.subConditionType !== "NONE"
            ? condition?.subConditionType
            : "";
        if (condition.operandType === "ATTRIBUTE") {
          operand = this.attributes.find(
            (item: any) => item.id === condition.operand
          );
          operand = operand?.name;
        } else if (
          ["DATE", "TIME_STAMP", "DATE_TIME"].includes(attribute.dataType)
        ) {
          const dateTimes = condition?.operand.split(","); // Split the input string by commas

          const formattedDates = dateTimes.map((dateTime: any) =>
            moment.utc(dateTime).format("YYYY/MM/DD")
          );
          const joinedString = formattedDates.join(" & ");
          const finalArray = [`${joinedString}`];
          operand = finalArray;
        } else {
          operand =
            condition?.operand !== ""
              ? condition?.operand
              : condition?.operandType.toLowerCase();
        }
        tooltipConditionText += `${conditionType} ${
          attribute.name
        } ${condition?.operatorType.toLowerCase()} to ${operand}`;
        if (condition.subConditions && condition.subConditions.length > 0) {
          tooltipConditionText += ` ${subConditionType} (`;
          tooltipConditionText += this.getSubConditionText(
            condition.subConditions,
            1
          );
          tooltipConditionText += ")";
        }
        tooltipConditionText += "<br>";
      });
    }
    return tooltipConditionText.trim();
  }

  /**
   * HANDLE THIS FUNCTION FOR HIERARCHICAL ADD SUBCONDITIONS
   * @param subConditions any
   * @param depth number
   * @returns
   */
  private getSubConditionText(subConditions: any[], depth: number): string {
    let subConditionText = "";
    let operand: any = "";

    if (subConditions && subConditions.length > 0) {
      subConditions.forEach((condition: any, index: number) => {
        subConditionText += index !== 0 ? this.getIndent(1) : "";
        const attribute = this.attributes.find(
          (item: any) => item.id === condition.attributeId
        );
        const conditionType =
          condition?.conditionType !== "NONE" ? condition?.conditionType : "";
        const subConditionType =
          condition?.subConditionType !== "NONE"
            ? condition?.subConditionType
            : "";
        if (condition.operandType === "ATTRIBUTE") {
          operand = this.attributes.find(
            (item: any) => item.id === condition.operand
          );
          operand = operand?.name;
        } else if (
          ["DATE", "TIME_STAMP", "DATE_TIME"].includes(attribute.dataType)
        ) {
          const dateTimes = condition?.operand.split(","); // Split the input string by commas

          const formattedDates = dateTimes.map((dateTime: any) =>
            moment.utc(dateTime).format("YYYY/MM/DD")
          );
          const joinedString = formattedDates.join(" & ");
          const finalArray = [`${joinedString}`];
          operand = finalArray;
        } else {
          operand =
            condition?.operand !== ""
              ? condition?.operand
              : condition?.operandType.toLowerCase(1);
        }

        subConditionText += `${conditionType} ${
          attribute.name
        } ${condition?.operatorType.toLowerCase()} to ${operand}`;
        if (condition.subConditions && condition.subConditions.length > 0) {
          subConditionText += ` ${subConditionType} (`;
          subConditionText += this.getSubConditionText(
            condition.subConditions,
            2
          );
          subConditionText += ")";
        }
      });
    }
    return subConditionText;
  }

  /**
   * HANDLE THIS FUNCTION FOR ADD ACTIONS
   * @param action any
   * @returns
   */
  public getActionTooltipText(action: any): string {
    let tooltipActionText = "";

    if (action) {
      if (action.ifActions && action.ifActions.length > 0) {
        tooltipActionText += `${this.getActionConditionsText(
          action.ifActions,
          3,
          "ELSE"
        )}<br>`;
      }

      if (action.elseActions && action.elseActions.length > 0) {
        tooltipActionText += this.getActionConditionsText(
          action.elseActions,
          3,
          "THEN"
        );
      }
    }

    return tooltipActionText;
  }

  /**
   * HANDLE THIS FUNCTION FOR ADD IFACTION AND ELSEACTION DATA
   * @param actions any
   * @param depth number
   * @returns
   */
  public getActionConditionsText(
    actions: any[],
    depth: number,
    type: any
  ): string {
    let tooltipActionConditionsText = `<b>${type}</b><br>`;
    tooltipActionConditionsText += this.getIndent(depth);

    if (actions && actions.length > 0) {
      actions.forEach((action: any, index: number) => {
        tooltipActionConditionsText += index !== 0 ? this.getIndent(3) : "";
        const operand = action?.operand !== "" ? action?.operand : "Blank";
        const attribute = this.attributes.find(
          (item: any) => item.id === action.attributeId
        );
        tooltipActionConditionsText += `${
          attribute.name
        } ${action.actionType.toLowerCase()} to ${operand}`;
        const lastAction = actions.length - 1;
        lastAction != index ? (tooltipActionConditionsText += "<br>") : "";
      });
    }

    return tooltipActionConditionsText;
  }

  /**
   * USE THIS FOR ADD EXTRA SPACES
   * @param depth number
   * @returns
   */
  private getIndent(depth: number): string {
    return "&nbsp;".repeat(depth); // You can adjust the number of spaces for indentation
  }

  ngAfterViewInit(): void {
    this.table.virtualization = true;
  }

  public renderData(data: any, itemHeader: Header) {
    if (itemHeader.pipe && itemHeader.pipe instanceof Function) {
      return itemHeader.pipe(data);
    }
    return data;
  }
}

export interface Header {
  name: string;
  column: string;
  width?: number;
  hidden?: boolean;
  pinned?: "left" | "right";
  flexGrow?: number;
  isSortable?: boolean;
  isFilterable?: boolean;
  sortDirection?: "asc" | "desc";
  canAutoResize?: boolean;
  pipe?: unknown;
  contentProjection?: boolean;
}

export interface Paginate {
  count: number;
  pageSize: number;
  limit: number;
  offset: number;
}
