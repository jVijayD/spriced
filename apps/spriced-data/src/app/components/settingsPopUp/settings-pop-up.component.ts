import { CommonModule } from "@angular/common";
import { Component, Inject, OnInit, Optional, ViewChild } from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from "@angular/forms";
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
import { takeUntil } from "rxjs";

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
    ReactiveFormsModule,
  ],
  templateUrl: "./settings-pop-up.component.html",
  styleUrls: ["./settings-pop-up.component.scss"],
})
export class SettingsPopUpComponent implements OnInit {
  settingsdata: any;
  noOfRecords = GridConstants.LIMIT;
  freeze = 0;
  displayFormat: any;
  showSystem = false;
  filteredlList: any = [];
  columnForm!: FormGroup;

  @ViewChild("all") private all!: MatOption;
  initialData: any;
  constructor(
    public dialogRef: MatDialogRef<SettingsPopUpComponent>,
    private settings: SettingsService,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder
  ) {
    this.columnForm = this.fb.group({
      column: new FormControl(""),
      search: new FormControl(""),
    });
    let result = this.settings.getGlobalSettings();
    if (result) {
      this.displayFormat = result.displayFormat || "code";
      this.showSystem = result.showSystem;
    }
    this.filteredlList = this.data.header.filter((item: any) => {
      return item.column !== "name" && item.column !== "code" && item.column !== "validation_status" && item.systemAttribute == false;
    });
    this.initialData=this.filteredlList
    let all = this.settings.getCurrentSettings(this.data.entity.name);
    if (all) {
      this.noOfRecords = all.noOfRecords || GridConstants.LIMIT;
      this.freeze = all.freeze || 0;
      if(all.columns.length!==0)
      {
      this.columnForm.controls["column"].patchValue(all.columns);
      }
      else {
        this.columnForm.controls["column"].patchValue([
          ...this.filteredlList.map((item: any) => item.selectColumn),
          "All",
        ]);
      } 
    } else {
      this.columnForm.controls["column"].patchValue([
        ...this.filteredlList.map((item: any) => item.selectColumn),
        "All",
      ]);
    }
  }

ngOnInit(): void {
    this.columnForm.controls["search"].valueChanges
      .subscribe(() => {
        this.filterSelection();
      });
}

  closeDialog() {
    this.dialogRef.close("Cancel");
  }
  save() {

   let data=["name", "code"];
   let selected =this.columnForm.controls["column"].value;
    selected.push(...data)
     this.columnForm.controls["column"].value.filter((item: any) => {
      if(item === "All")
      {
       selected=[]
      }
    });
    let value: any = {
      noOfRecords: this.noOfRecords,
      freeze: this.freeze,
      columns: selected,
    };
    this.settings.setSettings(this.data.entity.name, value);
    let all: any = {
      displayFormat: this.displayFormat,
      showSystem: this.showSystem,
    };
    this.settings.setSettings("all_entity", all);
    this.dialogRef.close("ok");
  }

  filterSelection() {
    let text= this.columnForm.controls["search"].value
    this.filteredlList = this.initialData.filter((item: any) => {
      return (
        item.name.trim().toLowerCase().indexOf(text.trim().toLowerCase()) != -1 
      );
    });
  }

  toggleAll() {
    if (this.all.selected) {
      this.columnForm.controls["column"].patchValue([
        ...this.filteredlList.map((item: any) => item.selectColumn),
        "All",
      ]);
    } else {
      this.columnForm.controls["column"].patchValue([]);
    }
  }
  tosslePerColumn() {
    if (this.all.selected) {
      this.all.deselect();
      return false;
    }
    if (
      this.columnForm.controls["column"].value.length ==
      this.initialData.length
    )
      this.all.select();
    return;
  }
}
