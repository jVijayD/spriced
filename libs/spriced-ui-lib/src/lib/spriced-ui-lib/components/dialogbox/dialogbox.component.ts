import { CommonModule } from '@angular/common';
import { Component, Inject, Input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'sp-dialogbox',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule],
  templateUrl: './dialogbox.component.html',
  styleUrls: ['./dialogbox.component.scss'],
})
export class DialogboxComponent {
  message: string = ""
  cancelButtonText = "Cancel";
  confirmationButtonText = "Delete";
  constructor(
    @Inject(MAT_DIALOG_DATA) private data: any,
    private dialogRef: MatDialogRef<DialogboxComponent>) {
    if (data) {
      this.message = data.message || this.message;
      this.confirmationButtonText = data.button?.confirmation;
      this.cancelButtonText = data.button?.cancel;
    }
    // this.dialogRef.updateSize('300vw','300vw')
  }

  onConfirmClick(value: any): void {
    this.dialogRef.close(value);
  }
}
