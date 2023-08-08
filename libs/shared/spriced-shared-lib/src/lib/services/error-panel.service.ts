import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { errorElement } from '@spriced-frontend/shared/spriced-shared-lib'

@Injectable({
  providedIn: 'root'
})
export class ErrorPanelService {
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
