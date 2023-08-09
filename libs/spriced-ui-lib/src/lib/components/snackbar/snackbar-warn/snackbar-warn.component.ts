import { Component, Inject } from '@angular/core';
import {
  MatSnackBarRef,
  MAT_SNACK_BAR_DATA,
} from '@angular/material/snack-bar';

@Component({
  selector: 'sp-snackbar-warn',
  templateUrl: './snackbar-warn.component.html',
  styleUrls: ['./snackbar-warn.component.scss'],
})
export class SnackbarWarnComponent {
  constructor(
    public sbRef: MatSnackBarRef<SnackbarWarnComponent>,
    @Inject(MAT_SNACK_BAR_DATA) public data: any
  ) {}

  onClose() {
    this.sbRef.dismiss();
  }
}
