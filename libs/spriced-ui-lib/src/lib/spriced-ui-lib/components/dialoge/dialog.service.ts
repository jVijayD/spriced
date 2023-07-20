import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import {
  ConfirmDialogComponent,
  ConfirmDialogData,
} from './confirm-dialog/confirm-dialog.component';
import { InfoDialogComponent } from './info-dialog/info-dialog.component';

@Injectable()
export class DialogService {
  constructor(private dialog: MatDialog) {}

  openConfirmDialoge(dialogData: ConfirmDialogData) {
    return this.dialog.open(ConfirmDialogComponent, {
      data: dialogData,
      maxWidth: dialogData.maxWidth ? dialogData.maxWidth + 'px' : undefined,
      minWidth: dialogData.maxWidth ? dialogData.minWidth + 'px' : undefined,
    });
  }

  openInfoDialog(dialogData: ConfirmDialogData) {
    return this.dialog.open(InfoDialogComponent, {
      data: dialogData,
      maxWidth: dialogData.maxWidth ? dialogData.maxWidth + 'px' : undefined,
      minWidth: dialogData.maxWidth ? dialogData.minWidth + 'px' : undefined,
    });
  }
}
