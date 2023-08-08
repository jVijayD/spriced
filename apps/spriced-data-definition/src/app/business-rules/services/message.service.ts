import { Injectable } from '@angular/core';
import { Subject, distinctUntilChanged } from 'rxjs';
import { SnackBarService } from '@spriced-frontend/spriced-ui-lib';
import { AppDataService, ErrorTypes, ErrorPanelService } from '@spriced-frontend/shared/spriced-shared-lib';
// import {
//   AppDataService,
//   ErrorTypes,
//   ErrorPanelService
// } from './../app-data/app-data.service';
// import { ErrorPanelService } from './../services/error-panel.service'

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  snackMessage = new Subject();

  constructor(
    private msgSrv: SnackBarService,
    private errorPanelService: ErrorPanelService,
    private appstoreService: AppDataService
  ) {}

  getMesaage(error: any) {
    this.appstoreService.menuData$
      .pipe(distinctUntilChanged())
      .subscribe((data: any) => {
        if (data[error.errorCode]) {
          this.msgSrv.error(data[error.errorCode]);
          this.errorPanelService.setErrors([
            {
              type: ErrorTypes.ERROR,
              msg: data[error.errorCode],
            },
          ]);
        } else {
          // this.msgSrv.error(error.message);
          this.errorPanelService.setErrors([
            {
              type: ErrorTypes.ERROR,
              msg: error.message,
            },
          ]);
        }
      });
  }
}
