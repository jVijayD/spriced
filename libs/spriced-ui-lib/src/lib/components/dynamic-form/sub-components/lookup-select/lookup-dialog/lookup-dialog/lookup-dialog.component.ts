import { Component, Inject } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { Attribute, EntityService } from "@spriced-frontend/spriced-common-lib";
import { ColumnMode, SelectionType, SortType } from "@swimlane/ngx-datatable";
import { Header } from "libs/spriced-ui-lib/src/lib/components/data-grid/data-grid.component";
import { DialogService } from "libs/spriced-ui-lib/src/lib/components/dialoge/dialog.service";
import { QueryColumns } from "libs/spriced-ui-lib/src/lib/components/dialoge/filter-dialog/filter-dialog.component";
import { Subject, timer } from "rxjs";
const TIMER_CONST = 50;
@Component({
  selector: "sp-lookup-dialog",
  templateUrl: "./lookup-dialog.component.html",
  styleUrls: ["./lookup-dialog.component.scss"],
})
export class LookupDialogComponent {
  columnMode: ColumnMode = ColumnMode.force;
  private dialogEventSubject = new Subject<any>();
  dialogEvent$ = this.dialogEventSubject.asObservable();
  count: any;
  offset: number = 0;
  item: any;
  pageSize: any;
  query?: any;
  pageNumber: any;
  filters: any;
  selected = [];
  selectedItem: any;
  rows: any = [];
  selectionType: SelectionType = SelectionType.single;
  sortType = SortType.single;
  SelectionType = SelectionType;
  att: any;
  constructor(
    private dialogRef: MatDialogRef<LookupDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: LookupDialogComponent,
    private dialogService: DialogService,
    private entityService: EntityService
  ) {}
  public headers: Header[] = [
    // {
    //   column: "id",
    //   name: "Id",
    //   canAutoResize: true,
    //   isSortable: true,
    //   width: 100
    // },
    {
      column: "code",
      name: "Code",
      canAutoResize: true,
      isSortable: true,
      width: 200,
    },
    {
      column: "name",
      name: "Name",
      canAutoResize: true,
      isSortable: true,
      width: 200,
    },
  ];

  ngOnInit() {
    const selectionTimer = timer(TIMER_CONST);
    if (this.data) {
      //Since the form not completely get loaded by the time data arrived.
      selectionTimer.subscribe(() => {
        this.item = this.data;
        this.count = this.item.total;
        this.pageSize = this.item.pageSize;
        this.selectedItem = this.item.selectedItem;
        this.rows = this.item.value;
        this.entityService.load(this.item.lookupId).subscribe((item: any) => {
          this.att = item.attributes.filter((item: any) => {
            return item.name == "code" || item.name == "name";
          });
        });
      });
    }
  }

  public onItemSelected(event: any) {
    this.selectedItem = event.selected[0];
  }
  public onSubmit() {
    this.dialogRef.close({ event: "Update", data: this.selectedItem });
    this.dialogEventSubject.next({ pageNubmer: this.pageNumber, filters: [] });
  }
  onPage(e: any) {
    this.pageNumber = e.offset;
    this.dialogEventSubject.next({
      pageNumber: this.pageNumber,
      filters: this.filters,
    });
  }
  upDatedData(newData: any) {
    this.rows = newData.value;
    this.count = newData.total;
    this.selectedItem = !!newData?.selectedItem
      ? newData.selectedItem
      : this.selectedItem;
  }
  onFilter() {
    const dialogResult = this.dialogService.openFilterDialog({
      persistValueOnFieldChange: true,
      columns: this.getFilterColumns(),
      emptyMessage: "Please select filter criteria.",
      config: null,
      query: this.query,
    });
    dialogResult.afterClosed().subscribe((val) => {
      this.query = dialogResult.componentInstance.data.query;
      this.filters = val;
      this.dialogEventSubject.next({
        pageNubmer: this.pageNumber,
        filters: this.filters,
      });
    });
  }

  onClearFilter() {
    this.query = null;
    this.filters = [];
    this.dialogEventSubject.next({
      pageNubmer: this.pageNumber,
      filters: this.filters,
    });
  }

  onCancel() {
    this.dialogRef.close(null);
  }

  getFilterColumns() {
    return this.att.map((col: any) => {
      return {
        name: col.name,
        displayName: col.displayName,
        dataType: this.getColumnDataType(col.dataType),
        options: col?.dataType === "category" ? col.options : undefined,
      };
    });
  }

  private getColumnDataType(
    attr: string
  ): "string" | "number" | "date" | "category" | "boolean" {
    switch (attr) {
      case "STRING_VAR":
      case "TEXT":
      case "LINK":
        return "string";
      case "TIME_STAMP":
        return "date";
      case "BOOLEAN":
        return "boolean";
      case "INTEGER":
      case "SERIAL":
      case "DECIMAL":
      case "AUTO":
        return "number";
      default:
        return "string";
    }
  }
}
