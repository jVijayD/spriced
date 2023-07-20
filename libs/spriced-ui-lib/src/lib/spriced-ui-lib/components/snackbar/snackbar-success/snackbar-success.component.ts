import { Component, Inject } from '@angular/core';
import {
  MatSnackBarRef,
  MAT_SNACK_BAR_DATA,
} from '@angular/material/snack-bar';

@Component({
  selector: 'sp-snackbar-success',
  //standalone: true,
  templateUrl: './snackbar-success.component.html',
  styleUrls: ['./snackbar-success.component.scss'],
})
export class SnackbarSuccessComponent {
  constructor(
    public sbRef: MatSnackBarRef<SnackbarSuccessComponent>,
    @Inject(MAT_SNACK_BAR_DATA) public data: any
  ) {}

  onClose() {
    this.sbRef.dismiss();
  }
}
