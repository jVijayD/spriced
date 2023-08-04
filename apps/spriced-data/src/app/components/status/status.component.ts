import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import {
  DataGridComponent,
  Header,
  OneColComponent,
} from "@spriced-frontend/spriced-ui-lib";
import { ColumnMode, SelectionType, SortType } from "@swimlane/ngx-datatable";
import { MatDialogRef } from "@angular/material/dialog";
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";

@Component({
  selector: "sp-status",
  standalone: true,
  imports: [CommonModule, OneColComponent, DataGridComponent,MatIconModule,MatButtonModule],
  templateUrl: "./status.component.html",
  styleUrls: ["./status.component.scss"],
})
export class StatusComponent {
  constructor(
    public dialogRef: MatDialogRef<StatusComponent>){}
  headers: Header[] = [
    { column: "entity", name: "Entity", canAutoResize: true, isSortable: true ,width:60},
    { column: "file", name: "File", canAutoResize: true, isSortable: true,width:60 },
    {
      column: "status",
      name: "Status",
      canAutoResize: true,
      isSortable: true,width:60
    },
  ];
  columnMode: ColumnMode = ColumnMode.force;
  selectionType: SelectionType = SelectionType.single;
  sortType = SortType.single;
  isFullScreen = false;
  rows: any[] =[{
    entity:'entity1',
    file:'de.csv',
    status:'In progress'
  },
  {
    entity:'entity0',
    file:'de.csv',
    status:'In progress'
  },{
    entity:'entity9',
    file:'de.csv',
    status:'In progress'
  },{
    entity:'entity8',
    file:'de.csv',
    status:'In progress'
  },{
    entity:'entity2',
    file:'de.csv',
    status:'In progress'
  },{
    entity:'entity2',
    file:'de.csv',
    status:'In progress'
  },
  {
    entity:'entity2',
    file:'de.csv',
    status:'In progress'
  },{
    entity:'entity2',
    file:'de.csv',
    status:'In progress'
  },{
    entity:'entity2',
    file:'de.csv',
    status:'In progress'
  },{
    entity:'entity2',
    file:'de.csv',
    status:'In progress'
  },{
    entity:'entity2',
    file:'de.csv',
    status:'In progress'
  },{
    entity:'entity2',
    file:'de.csv',
    status:'In progress'
  },{
    entity:'entity2',
    file:'de.csv',
    status:'In progress'
  },{
    entity:'entity2',
    file:'de.csv',
    status:'In progress'
  },{
    entity:'entity2',
    file:'de.csv',
    status:'In progress'
  },{
    entity:'entity2',
    file:'de.csv',
    status:'In progress'
  },{
    entity:'entity2',
    file:'de.csv',
    status:'In progress'
  },{
    entity:'entity2',
    file:'de.csv',
    status:'In progress'
  },
];
  selectedItem: any = null;
  totalElements=this.rows.length


  onClose()
  {
    this.dialogRef.close({ event: "Cancel" });
  }
}
