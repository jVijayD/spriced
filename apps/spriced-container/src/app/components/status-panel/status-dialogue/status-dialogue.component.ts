import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { errorElement } from '@spriced-frontend/spriced-common-lib';
import { MatTableModule } from '@angular/material/table';
import { HeaderActionComponent } from '@spriced-frontend/spriced-ui-lib';
@Component({
  standalone: true,
  imports: [CommonModule, MatIconModule,MatTableModule,HeaderActionComponent],
  selector: 'sp-status-dialogue',
  templateUrl: './status-dialogue.component.html',
  styleUrls: ['./status-dialogue.component.scss'],
})
export class StatusDialogueComponent {
  displayedColumns = ['type','msg'];
  constructor(
    public dialogRef: MatDialogRef<StatusDialogueComponent>,
    @Inject(MAT_DIALOG_DATA) public data: errorElement[]
  ) {}
  dataSource = this.data;

  onNoClick(): void {
    this.dialogRef.close();
  }
}
