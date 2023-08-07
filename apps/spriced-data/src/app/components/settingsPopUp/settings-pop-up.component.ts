import { CommonModule } from "@angular/common";
import { Component, Inject, OnInit, Optional } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatCardModule } from "@angular/material/card";
import { MatSelectModule } from "@angular/material/select";

import { MatOptionModule } from "@angular/material/core";
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from "@angular/material/dialog";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatFormFieldModule } from "@angular/material/form-field";
import { NgxIndexedDBService } from "ngx-indexed-db";

@Component({
  selector: "sp-settings-pop-up",
  standalone: true,
  imports: [
    CommonModule,
    MatInputModule,
    MatDialogModule,
    MatIconModule,
    MatButtonModule,
    MatCheckboxModule,
    MatOptionModule,
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatSelectModule,
  ],
  templateUrl: "./settings-pop-up.component.html",
  styleUrls: ["./settings-pop-up.component.scss"],
})
export class SettingsPopUpComponent {
  settingsdata: any;
  constructor(
    public dialogRef: MatDialogRef<SettingsPopUpComponent>,
    private dbService: NgxIndexedDBService,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    console.log(data);
  }
  noOfRecords = 0;
  freeze = 0;
  displayFormat: any;
  showSystem = true;
  closeDialog() {
    this.dialogRef.close({ event: "Cancel" });
  }

  save() {
    // this.dbService
    //   .add("this_entity", {
    //     entity: this.data.name,
    //     noOfRecords: this.noOfRecords,
    //     freeze: this.freeze,
    //   })
    //   .subscribe((key) => {
    //     console.log("key: ", key);
    //   });
    let value: any = { noOfRecords: this.noOfRecords, freeze: this.freeze };
    localStorage.setItem(this.data.name, JSON.stringify(value));

    this.dbService
      .add("all_entity", {
        id: 1,
        displayFormat: this.displayFormat,
        showSystem: this.showSystem,
      })
      .subscribe((key) => {
        console.log("key: ", key);
      });
    this.dialogRef.close();
  }
}
