import { Component, Inject, OnInit, Optional } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
// import { AppStoreService } from '@spriced-frontend/shared/data-store';
import { NgxIndexedDBService } from 'ngx-indexed-db';
@Component({
  selector: 'sp-settings-pop-up',
  templateUrl: './settings-pop-up.component.html',
  styleUrls: ['./settings-pop-up.component.scss'],
})
export class SettingsPopUpComponent {
  settingsdata: any;
  constructor(
    public dialogRef: MatDialogRef<SettingsPopUpComponent>,
    private dbService: NgxIndexedDBService,
    // private appstoreService: AppStoreService,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,

  ) {
    console.log(data)
  }
  noOfRecords = 0;
  freeze = 0;
  displayFormat: any;
  showSystem = true;
  closeDialog() {
    this.dialogRef.close({ event: 'Cancel' });
  }

  save() {
    this.dbService
      .add('this_entity', {
        entity: this.data,
        noOfRecords: this.noOfRecords,
        freeze: this.freeze,
      })
      .subscribe((key) => {
        console.log('key: ', key);
      });
    this.dbService
      .add('all_entity', {
        id: 1,
        displayFormat: this.displayFormat,
        showSystem: this.showSystem,
      })
      .subscribe((key) => {
        console.log('key: ', key);
      });

   
    const settings = {
      displayFormat: this.displayFormat,
      showSystem: this.showSystem,
    };
    // this.appstoreService.setSettings(settings);
    this.dialogRef.close();
  }
}
