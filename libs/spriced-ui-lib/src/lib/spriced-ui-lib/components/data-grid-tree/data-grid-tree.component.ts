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
import { Paginate } from "../data-grid/data-grid.component";
import { MatIconModule } from "@angular/material/icon";

@Component({
  selector: "sp-data-grid-tree",
  standalone: true,
  imports: [CommonModule, NgxDatatableModule, MatIconModule],
  templateUrl: "./data-grid-tree.component.html",
  styleUrls: ["./data-grid-tree.component.scss"],
})
export class DataGridTreeComponent implements AfterViewInit {
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
  headers: Head[] = [];

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

  @Output()
  onTreeExpand: EventEmitter<any> = new EventEmitter<any>();

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
  onTreeAction(event: any) {
    this.onTreeExpand.emit(event);
  }
  public renderData(data: any, itemHeader: Head) {
    if (itemHeader.pipe && itemHeader.pipe instanceof Function) {
      return itemHeader.pipe(data);
    }
    return data;
  }
}
export interface Head {
  name: string;
  column: string;
  isTreeColumn: boolean;
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
