import { Component, Inject } from '@angular/core';
import {
  MAT_SNACK_BAR_DATA,
  MatSnackBarRef,
} from '@angular/material/snack-bar';

@Component({
  selector: 'sp-snackbar-failure',
  templateUrl: './snackbar-failure.component.html',
  styleUrls: ['./snackbar-failure.component.scss'],
})
export class SnackbarFailureComponent {
  constructor(
    public sbRef: MatSnackBarRef<SnackbarFailureComponent>,
    @Inject(MAT_SNACK_BAR_DATA) public data: any
  ) {}

  onClose() {
    this.sbRef.dismiss();
  }
}
