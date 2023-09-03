import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  Output,
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
import { ExportFileService } from "./export-file";

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
  providers: [ExportFileService],
  templateUrl: "./data-grid.component.html",
  styleUrls: ["./data-grid.component.scss"],
  //changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DataGridComponent implements AfterViewInit {
  @ViewChild(DatatableComponent)
  table!: DatatableComponent;
  loading: boolean = false;
  hidden: boolean = false;

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

  @Input()
  tooltipTemplate: any;

  @Output()
  itemSelected: EventEmitter<any> = new EventEmitter<any>();

  @Output()
  paginate: EventEmitter<Paginate> = new EventEmitter<Paginate>();

  @Output()
  expression: EventEmitter<any> = new EventEmitter<any>();

  @Output()
  checkbox: EventEmitter<any> = new EventEmitter<any>();

  @Output()
  sort: EventEmitter<any> = new EventEmitter<any>();

  constructor(private exportService: ExportFileService) {}

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

  public export(format: "csv" | "xlsx" | "pdf") {
    switch (format) {
      case "csv":
        this.exportService.exportToCsv(this.rows, this.headers, this.title);
        break;
      case "xlsx":
        this.exportService.exportToExcel(this.rows, this.headers, this.title);
        break;
      case "pdf":
        this.exportService.exportToPdf(this.rows, this.headers, this.title);
        break;
    }
  }

  public exportServerData(format: "csv" | "xlsx" | "pdf", data: any) {
    switch (format) {
      case "csv":
        this.exportService.exportServerDataToCsv();
        break;
      case "xlsx":
        this.exportService.exportServerDataToExcel();
        break;
      case "pdf":
        this.exportService.exportServerDataToPdf();
        break;
    }
  }

  public redraw() {
    this.hidden = true;
    const timeOut = setTimeout(() => {
      this.hidden = false;
      clearTimeout(timeOut);
    }, 10);
  }

  ngAfterViewInit(): void {
    //this.table.virtualization = false;
  }

  public renderData(data: any, itemHeader: Header) {
    if (itemHeader.pipe && itemHeader.pipe instanceof Function) {
      return itemHeader.pipe(data);
    }
    return data;
  }

  public getData(row: any, itemHeader: Header) {
    const headers = itemHeader.column.split(",");

    return headers.reduce((prev, cur) => {
      return prev === "-##" ? row[cur] : `${prev} {${row[cur]}}`;
    }, "-##");
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
  //contentProjection?: boolean;
  checkbox?: boolean;
  tooltip?: boolean;
  tooltipTemplate?: any;
  imgsrc?: any;
  disableCheckbox?: any;
}

export interface Paginate {
  count: number;
  pageSize: number;
  limit: number;
  offset: number;
}

export class GridConstants {
  static LIMIT = 50;
}
