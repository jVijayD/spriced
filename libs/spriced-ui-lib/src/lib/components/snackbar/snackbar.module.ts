import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SnackbarSuccessComponent } from './snackbar-success/snackbar-success.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { SnackBarService } from './snackbar.service';
import { MatIconModule } from '@angular/material/icon';
import { SnackbarNotificationComponent } from './snackbar-notification/snackbar-notification.component';
import { SnackbarWarnComponent } from './snackbar-warn/snackbar-warn.component';
import { SnackbarFailureComponent } from './snackbar-failure/snackbar-failure.component';

@NgModule({
  declarations: [
    SnackbarSuccessComponent,
    SnackbarNotificationComponent,
    SnackbarWarnComponent,
    SnackbarFailureComponent,
  ],
  imports: [CommonModule, MatSnackBarModule, MatIconModule],
  providers: [SnackBarService],
  exports: [
    SnackbarSuccessComponent,
    SnackbarNotificationComponent,
    SnackbarWarnComponent,
    SnackbarFailureComponent,
  ],
})
export class SnackbarModule {}
