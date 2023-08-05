import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface errorElement {
  type: ErrorTypes;
  cmp?: string;
  msg: string;
}
export enum ErrorTypes {
  ERROR = 'Error',
  WARNING = 'Warning',
}

@Injectable({
  providedIn: 'root',
})
export class StatusPannelService {
  ERROR_LIST: BehaviorSubject<errorElement[]> = new BehaviorSubject<
    errorElement[]
  >([]);

  $ERROR_LIST = this.ERROR_LIST.asObservable();

  init(): void {
    this.setErrors([]);
  }

  setErrors(errorList: errorElement[]): void {
    this.ERROR_LIST.next(errorList);
  }
  getErrors() {
    return this.$ERROR_LIST;
  }
}
