import { Component, Inject, OnInit, Optional } from "@angular/core";
import { CommonModule } from "@angular/common";
import {
  DataGridComponent,
  Header,
  HeaderActionComponent,
  OneColComponent,
} from "@spriced-frontend/spriced-ui-lib";
import { ColumnMode, SelectionType, SortType } from "@swimlane/ngx-datatable";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";
import { EntityDataService } from "../../services/entity-data.service";
import { Router, RouterModule } from "@angular/router";

@Component({
  selector: "sp-status",
  standalone: true,
  imports: [
    CommonModule,
    OneColComponent,
    DataGridComponent,
    MatIconModule,
    MatButtonModule,
    HeaderActionComponent,
    RouterModule,
  ],
  templateUrl: "./status.component.html",
  styleUrls: ["./status.component.scss"],
})
export class StatusComponent implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<StatusComponent>,
    private dataService: EntityDataService,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any
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
      column: "updatedBy",
      name: "Uploaded By",
      canAutoResize: true,
      isSortable: true,
      width: 60,
    },
    {
      column: "status",
      name: "Upload Status",
      canAutoResize: true,
      isSortable: true,
      width: 60,
    },
    {
      column: "updatedDate",
      name: "Uploaded Date",
      canAutoResize: true,
      isSortable: true,
      width: 60,
    },
    {
      column: "",
      name: "Download",
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
  totalElements = 100;

  onClose() {
    this.dialogRef.close({ event: "Cancel" });
  }
  ngOnInit(): void {
    this.dataService.getStatus().subscribe((val: any) => {
      val = val.filter((value: any) => {
        var entityName=value.entityName.substring(0, value.entityName.indexOf('_'))
        return entityName == this.data.name;
      }); 
      this.rows = [...val];
      this.totalElements = this.rows.length;
    });
  }
  onItemSelected(e: any) {
    this.selectedItem = e;
  }
  viewError()
  {
    setTimeout(() => {
    this.dataService.downloadErrorExcel(
      this.selectedItem?.id as number
    );
  }, 500);
    // this.dialogRef.close();
    // this.router.navigate(["/spriced-data/upload-error/"  + this.data.groupId + "/" +this.data.id ]);
  }
}
