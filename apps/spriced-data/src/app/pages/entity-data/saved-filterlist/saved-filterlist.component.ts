import { Component, Inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import { DataGridComponent, Header, HeaderActionComponent, OneColComponent } from "@spriced-frontend/spriced-ui-lib";
import { MatButtonModule } from "@angular/material/button";
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from "@angular/material/dialog";
import { ColumnMode, SelectionType } from "@swimlane/ngx-datatable";
import { equal } from "assert";
import { DialogRef } from "@angular/cdk/dialog";
import { EntityDataService } from "../../../services/entity-data.service";

@Component({
  selector: "sp-saved-filterlist",
  standalone: true,
  imports: [CommonModule, MatButtonModule, DataGridComponent, MatDialogModule, OneColComponent,HeaderActionComponent],
  templateUrl: "./saved-filterlist.component.html",
  styleUrls: ["./saved-filterlist.component.scss"],
})
export class SavedFilterlistComponent {
  rows: any[] = []
  selectedItem: any = null;
  totalElements = 0;

  constructor(public dialogRef: MatDialogRef<SavedFilterlistComponent>, 
    @Inject(MAT_DIALOG_DATA) public data: any,
    private entityDataService:EntityDataService
  ) {
    this.rows = data
    this.selectedItem = this.rows[0]
    this.totalElements = data.length;
  }
  headers: Header[] = [
    {
      column: "filterName",
      name: "Name",
      canAutoResize: true,
      isSortable: false,
      width: 100,
    },
  ]
  columnMode: ColumnMode = ColumnMode.force;
  selectionType: SelectionType = SelectionType.single;
  onItemSelected(event: any) {
    this.selectedItem = event
  }
  closeDialog() {
    this.dialogRef.close()
  }
  onApply() {
    this.dialogRef.close(this.selectedItem)

  }
  onDelete()
  {
this.entityDataService.deleteFilter(this.selectedItem)
console.log(this.rows,this.selectedItem)
this.rows=this.rows.filter((val:any)=> {
  console.log(val.filterName,this.selectedItem.filterName)
  return this.selectedItem.filterName !=val.filterName
  })
  console.log(this.rows)
  }
}
