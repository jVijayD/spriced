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

@Component({
  selector: "sp-data-grid",
  standalone: true,
  imports: [CommonModule, NgxDatatableModule],
  templateUrl: "./data-grid.component.html",
  styleUrls: ["./data-grid.component.scss"],
  //changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DataGridComponent implements AfterViewInit {
  @ViewChild(DatatableComponent)
  table!: DatatableComponent;

  @Input()
  title = "";

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

  ngAfterViewInit(): void {
    this.table.virtualization = true;
  }

  public renderData(data: any, itemHeader: Header) {
    debugger;
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
}

export interface Paginate {
  count: number;
  pageSize: number;
  limit: number;
  offset: number;
}
