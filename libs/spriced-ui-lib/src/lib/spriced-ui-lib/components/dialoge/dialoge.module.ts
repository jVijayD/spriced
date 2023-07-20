import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfirmDialogComponent } from './confirm-dialog/confirm-dialog.component';
import { InfoDialogComponent } from './info-dialog/info-dialog.component';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { DialogService } from './dialog.service';

@NgModule({
  declarations: [ConfirmDialogComponent, InfoDialogComponent],
  imports: [CommonModule, MatButtonModule, MatDialogModule, MatIconModule],
  providers: [DialogService],
  exports: [ConfirmDialogComponent, InfoDialogComponent],
})
export class DialogueModule {}
