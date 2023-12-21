import { CommonModule } from "@angular/common";
import { Component, Inject, OnInit, Optional, ViewChild } from "@angular/core";
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatCardModule } from "@angular/material/card";
import { MatSelectModule } from "@angular/material/select";

import { MatOption, MatOptionModule } from "@angular/material/core";
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from "@angular/material/dialog";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatFormFieldModule } from "@angular/material/form-field";
import { SettingsService } from "./service/settings.service";
import { GridConstants } from "@spriced-frontend/spriced-ui-lib";
import { NgxMatSelectSearchModule } from "ngx-mat-select-search";

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
    NgxMatSelectSearchModule,
    ReactiveFormsModule
    ],
  templateUrl: "./settings-pop-up.component.html",
  styleUrls: ["./settings-pop-up.component.scss"],
})
export class SettingsPopUpComponent {
  settingsdata: any;
  noOfRecords = GridConstants.LIMIT;
  freeze = 0;
  displayFormat: any;
  showSystem = false;
  filteredlList: any;
  columnForm!: FormGroup;

  @ViewChild('all') private all!: MatOption;
  constructor(
    public dialogRef: MatDialogRef<SettingsPopUpComponent>,
    private settings: SettingsService,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder
  ) {
    let result = this.settings.getGlobalSettings();
    if (result) {
      this.displayFormat = result.displayFormat || "code";
      this.showSystem = result.showSystem;
    }
    let all = this.settings.getCurrentSettings(this.data.entity.name);
    if (all) {
      this.noOfRecords = all.noOfRecords || GridConstants.LIMIT;
      this.freeze = all.freeze || 0;
    }
    this.filteredlList=this.data.header
  }
  ngOnInit(): void {
    this.columnForm = this.fb.group({
      column: new FormControl(''),
    });
  }
  closeDialog() {
    this.dialogRef.close("Cancel");
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

    // this.dbService
    //   .add("all_entity", {
    //     id: 1,
    //     displayFormat: this.displayFormat,
    //     showSystem: this.showSystem,
    //   })
    //   .subscribe((key) => {
    //     console.log("key: ", key);
    //   });
    let all: any = {
      displayFormat: this.displayFormat,
      showSystem: this.showSystem,
    };
    localStorage.setItem("all_entity", JSON.stringify(all));
    this.dialogRef.close('ok');
  }


  filterSelection(text: any) {
    this.filteredlList = this.data.header.filter((item: any) => {
      return (
        item.name
          .trim()
          .toLowerCase()
          .indexOf(text.trim().toLowerCase()) != -1
      );
    });
  }

  toggleAll()
  {
      if (this.all.selected) {
        this.columnForm.controls["column"].patchValue([
          ...this.data.header.map((item:any) => item.column),
          'All',
        ]);
      } else {
        this.columnForm.controls["column"].patchValue([]);
      }
  }
  tosslePerColumn()
  {
    if (this.all.selected) {
      this.all.deselect();
      return false;
    }
    if (
      this.columnForm.controls["column"].value.length ==
      this.data.header.length
    )
      this.all.select();
    return;
  }

}
