import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { DataGridComponent, Header, OneColComponent } from "@spriced-frontend/spriced-ui-lib";
import { MatButtonModule } from "@angular/material/button";
import { MatDialogModule } from "@angular/material/dialog";
import { ColumnMode, SelectionType } from "@swimlane/ngx-datatable";
import { equal } from "assert";

@Component({
  selector: "sp-saved-filterlist",
  standalone: true,
  imports: [CommonModule, MatButtonModule, DataGridComponent, MatDialogModule, OneColComponent],
  templateUrl: "./saved-filterlist.component.html",
  styleUrls: ["./saved-filterlist.component.scss"],
})
export class SavedFilterlistComponent {
  headers: Header[] = [
    {
      column: "Name",
      name: "name",
      canAutoResize: true,
      isSortable: false,
      width: 100,
    },
    {
      column: "Action",
      name: "action",
      canAutoResize: true,
      isSortable: false,
      width: 100,
    },
  ]
  columnMode: ColumnMode = ColumnMode.force;
  selectionType: SelectionType = SelectionType.single;
  totalElements = 10000;
  rows: any[] = [{
    name: "name is equal to sdjhg",
    action: 'apply'
  },
  {
    name: "name is equal to sdjhg",
    action: 'apply'
  },
  {
    name: "name is equal to sdjhg",
    action: 'apply'
  },
  {
    name: "name is equal to sdjhg",
    action: 'apply'
  },
  {
    name: "name is equal to sdjhg",
    action: 'apply'
  },
  {
    name: "name is equal to sdjhg",
    action: 'apply'
  },
  {
    name: "name is equal to sdjhg",
    action: 'apply'
  },

  ];
  selectedItem: any = null;

  onItemSelected(event: any) {

  }
}
