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
  pageSize:any;
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
      this.item = this.data;
      this.count = this.item.total;
      this.pageSize = this.item.pageSize;
      console.log()
      this.rows = this.item.value;
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
}
   upDatedData(newData:any){
    this.rows = newData.value;
   }
   onCancel(){
    this.dialogRef.close(null);
   }
}
