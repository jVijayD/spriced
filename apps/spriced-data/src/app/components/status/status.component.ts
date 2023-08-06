import { Component, OnInit } from "@angular/core";
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
import { EntityDataService } from "../../services/entity-data.service";

@Component({
  selector: "sp-status",
  standalone: true,
  imports: [
    CommonModule,
    OneColComponent,
    DataGridComponent,
    MatIconModule,
    MatButtonModule,
  ],
  templateUrl: "./status.component.html",
  styleUrls: ["./status.component.scss"],
})
export class StatusComponent implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<StatusComponent>,
    private dataService: EntityDataService
  ) {}
  headers: Header[] = [
    {
      column: "entityName",
      name: "Entity",
      canAutoResize: true,
      isSortable: true,
      width: 60,
    },
    {
      column: "filePath",
      name: "File",
      canAutoResize: true,
      isSortable: true,
      width: 60,
    },
    {
      column: "status",
      name: "Status",
      canAutoResize: true,
      isSortable: true,
      width: 60,
    },
  ];
  columnMode: ColumnMode = ColumnMode.force;
  selectionType: SelectionType = SelectionType.single;
  sortType = SortType.single;
  isFullScreen = false;
  rows: any[] = [];
  selectedItem: any = null;
  totalElements = this.rows.length;

  onClose() {
    this.dialogRef.close({ event: "Cancel" });
  }
  ngOnInit(): void {
    this.dataService.getStatus().subscribe((val: any) => {
      this.rows = val;
    });
  }
}
