import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackbarSuccessComponent } from './snackbar-success/snackbar-success.component';
import { SnackbarFailureComponent } from './snackbar-failure/snackbar-failure.component';
import { SnackbarNotificationComponent } from './snackbar-notification/snackbar-notification.component';
import { SnackbarWarnComponent } from './snackbar-warn/snackbar-warn.component';

const SNACKBAR_OPEN_TIME = 20000;

@Injectable()
export class SnackBarService {
  constructor(private snackBar: MatSnackBar) {}
  public success(message: string) {
    this.snackBar.openFromComponent(SnackbarSuccessComponent, {
      duration: SNACKBAR_OPEN_TIME,
      horizontalPosition: 'end',
      verticalPosition: 'top',
      data: message,
    });
  }
  public error(message: string) {
    this.snackBar.openFromComponent(SnackbarFailureComponent, {
      duration: SNACKBAR_OPEN_TIME,
      horizontalPosition: 'end',
      verticalPosition: 'top',
      data: message,
    });
  }

  public notification(message: string) {
    this.snackBar.openFromComponent(SnackbarNotificationComponent, {
      duration: SNACKBAR_OPEN_TIME,
      horizontalPosition: 'end',
      verticalPosition: 'top',
      data: message,
    });
  }

  public warn(message: string) {
    this.snackBar.openFromComponent(SnackbarWarnComponent, {
      duration: SNACKBAR_OPEN_TIME,
      horizontalPosition: 'end',
      verticalPosition: 'top',
      data: message,
    });
  }
}
