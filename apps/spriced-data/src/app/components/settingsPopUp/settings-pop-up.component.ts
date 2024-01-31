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
  displayFormat = "namecode";
  showSystem = false;
  filteredlList: any = [];
  columnForm!: FormGroup;

  @ViewChild("all") private all!: MatOption;
  initialData: any;
  globalSettings: any = {
    settingsData: { displayFormat: "namecode", showSystem: false },
  };
  currentSettings: any = {
    settingsData: {
      noOfRecords: GridConstants.LIMIT,
      freeze: 0,
      columns: [],
    },
  };
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
    this.settings.getGlobalSettings().subscribe((results: any) => {
      if (results?.settingsData) {
        this.globalSettings = results;
        this.displayFormat =
          this.globalSettings.settingsData.displayFormat || "namecode";
        this.showSystem = this.globalSettings.settingsData.showSystem || false;
      }
    });
    this.filteredlList = this.data.header.filter((item: any) => {
      return (
        item.column !== "name" &&
        item.column !== "code" &&
        item.column !== "validation_status" &&
        item.systemAttribute == false
      );
    });
    this.initialData = this.filteredlList;
    this.settings
      .getCurrentSettings(this.data.entity)
      .subscribe((results: any) => {
        if (results?.settingsData) {
          this.currentSettings = results;
          this.noOfRecords =
            results.settingsData.noOfRecords || GridConstants.LIMIT;
          this.freeze = results.settingsData.freeze || 0;
          if (
            results.settingsData.columns !== null &&
            results.settingsData.columns?.length !== 0
          ) {
            this.columnForm.controls["column"].patchValue(
              results.settingsData.columns
            );
          } else {
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
      });
  }

  ngOnInit(): void {
    this.columnForm.controls["search"].valueChanges.subscribe(() => {
      this.filterSelection();
    });
  }

  closeDialog() {
    this.dialogRef.close("Cancel");
  }
  save() {
    let global = this.globalSettings;
    let current = this.currentSettings;
    let data = ["name", "code"];
    let selected = this.columnForm.controls["column"].value;
    selected.push(...data);
    this.columnForm.controls["column"].value.filter((item: any) => {
      if (item === "All") {
        selected = [];
      }
    });
    if (this.currentSettings?.id) {
      this.currentSettings = {
        id: this.currentSettings.id,
        entityId: this.data.entity.id,
        groupId: this.data.entity.groupId,
        settingsData: {
          noOfRecords: this.noOfRecords,
          freeze: this.freeze,
          columns: selected,
          displayFormat: this.displayFormat,
          showSystem: this.showSystem,
        },
        type: "entity",
      };
      if (
        current?.settingsData.noOfRecords !==
          this.currentSettings?.settingsData.noOfRecords &&
        current?.settingsData.freeze !==
          this.currentSettings?.settingsData.freeze &&
        current?.settingsData.columns !==
          this.currentSettings?.settingsData.columns
      ) {
        this.settings
          .putSettings(this.currentSettings)
          .subscribe((result: any) => {});
      }
    } else {
      this.currentSettings = {
        entityId: this.data.entity.id,
        groupId: this.data.entity.groupId,
        settingsData: {
          noOfRecords: this.noOfRecords,
          freeze: this.freeze,
          columns: selected,
        },
        type: "entity",
      };
      if (
        current?.settingsData.noOfRecords !==
          this.currentSettings?.settingsData.noOfRecords &&
        current?.settingsData.freeze !==
          this.currentSettings?.settingsData.freeze &&
        current?.settingsData.columns !==
          this.currentSettings?.settingsData.columns
      ) {
        this.settings
          .setSettings(this.currentSettings)
          .subscribe((result: any) => {});
      }
    }

    if (this.globalSettings?.id) {
      this.globalSettings = {
        id: this.globalSettings.id,
        settingsData: {
          displayFormat: this.displayFormat,
          showSystem: this.showSystem,
        },
        type: "global",
      };
      if (
        global?.settingsData.displayFormat !==
          this.globalSettings?.settingsData.displayFormat &&
        global?.settingsData.showSystem !==
          this.globalSettings?.settingsData.showsystem
      ) {
        this.settings
          .putSettings(this.globalSettings)
          .subscribe((result: any) => {
          });
      }

    } else {
      this.globalSettings = {
        settingsData: {
          displayFormat: this.displayFormat,
          showSystem: this.showSystem,
        },
        type: "global",
      };
      if (
        global?.settingsData.displayFormat !==
          this.globalSettings?.settingsData.displayFormat &&
        global?.settingsData.showSystem !==
          this.globalSettings?.settingsData.showsystem
      ) {
        this.settings
          .setSettings(this.globalSettings)
          .subscribe((result: any) => {});
      }
    }
    this.dialogRef.close({
      event: "ok",
      value: this.globalSettings,
    });
  }

  filterSelection() {
    let text = this.columnForm.controls["search"].value;
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
      this.columnForm.controls["column"].value.length == this.initialData.length
    )
      this.all.select();
    return;
  }
}
