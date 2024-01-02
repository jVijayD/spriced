import { Component, Inject } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
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
  count:any;
  offset:number=0;
  item:any;
  pageSize:any;
  query?: any;
  pageNumber:any;
  filters:any;
  selected=[];
  selectedItem: any;
  rows: any = [];
  selectionType: SelectionType = SelectionType.single;
  sortType = SortType.single;
  SelectionType = SelectionType;
  constructor(
    private dialogRef: MatDialogRef<LookupDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: LookupDialogComponent,
    private dialogService: DialogService,
    ){
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
    const selectionTimer = timer(TIMER_CONST);
        if (this.data) {
          //Since the form not completely get loaded by the time data arrived.
          selectionTimer.subscribe(() => {
            this.item = this.data;
            this.count = this.item.total;
            this.pageSize = this.item.pageSize;
            this.selectedItem = this.item.selectedItem;
            console.log()
            this.rows = this.item.value;
          });
        }
  }

  public onItemSelected(event: any) {
   this.selectedItem = event.selected[0];
  }
  public onSubmit(){
    this.dialogRef.close({ event: "Update", data: this.selectedItem });
  }
  onPage(e: any) {
    this.pageNumber = e.offset;
    this.dialogEventSubject.next({ pageNumber:this.pageNumber,filters:this.filters });
}
   upDatedData(newData:any){
    this.rows = newData.value;
    this.count = newData.total;
    this.selectedItem = !!newData?.selectedItem ? newData.selectedItem : this.selectedItem;
   }
   onFilter(){
    const dialogResult = this.dialogService.openFilterDialog({
      persistValueOnFieldChange: true,
      columns:this.getFilterColumns(this.headers),
      emptyMessage: "Please select filter criteria.",
      config: null,
      query: this.query,
    });
    dialogResult.afterClosed().subscribe((val) => {
      this.query = dialogResult.componentInstance.data.query;
      this.filters = val;
       this.dialogEventSubject.next({ pageNubmer:this.pageNumber, filters:this.filters });
    });
   }

   onClearFilter(){
    this.query = null;
    this.filters = [];
    this.dialogEventSubject.next({ pageNubmer:this.pageNumber, filters: this.filters });
   }
   
   onCancel(){
    this.dialogRef.close(null);
   }

   getFilterColumns(headers: Header[]): QueryColumns[] {
    return headers
      .map((col: any) => {
        return {
          name: col.column,
          displayName: col.name,
          dataType:  "string",
          options: col?.dataType === "category" ? col.options : undefined,
        };
      });
  }

}
