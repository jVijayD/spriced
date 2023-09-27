import { Component, Inject } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { ColumnMode, SelectionType, SortType } from "@swimlane/ngx-datatable";
import { Header } from "libs/spriced-ui-lib/src/lib/components/data-grid/data-grid.component";
import { Subject } from "rxjs";

@Component({
  selector: "sp-lookup-dialog",
  templateUrl: "./lookup-dialog.component.html",
  styleUrls: ["./lookup-dialog.component.scss"],
})
export class LookupDialogComponent {
  columnMode: ColumnMode = ColumnMode.force;
  private dialogEventSubject = new Subject<void>();
  dialogEvent$ = this.dialogEventSubject.asObservable();
  count:any;
  offset:number=0;
  item:any;
  pageSize:number = 30;
  selected=[];
  selectedItem: any;
  rows: any = [];
  selectionType: SelectionType = SelectionType.single;
  sortType = SortType.single;
  SelectionType = SelectionType;
  constructor(
    private dialogRef: MatDialogRef<LookupDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: LookupDialogComponent,
    ){
      debugger
      this.item = data;
      this.count = this.item.total;
      console.log()
  }
  public headers: Header[] = [
    {
      column: "id",
      name: "Id",
      canAutoResize: true,
      isSortable: true,
      width: 100
    },
    {
      column: "code",
      name: "Code",
      canAutoResize: true,
      isSortable: true,
      width: 200
    },
    {
      column: "name",
      name: "Name",
      canAutoResize: true,
      isSortable: true,
      width: 200
    }
  ]
 
  ngOnInit(){
    this.rows = this.item.value;
  }

  public onItemSelected(event: any) {
   this.selectedItem = event.selected[0];
  }
  public onSubmit(){
    this.dialogRef.close({ event: "Update", data: this.selectedItem });
  }
  onPage(e: any) {
    debugger
    const pageNumber = e.offset;
    this.dialogEventSubject.next(pageNumber);
  // this.offset = event.offset;
  // const start = this.offset * this.pageSize;
  // const end = start + this.pageSize;
  // this.row= this.rows.slice(start, end);
  // this.entityDataService.loadLookupData(1, this.offset);
}
  ngOnChanges(){
    debugger
    this.rows = this.item.value;
  }
}
