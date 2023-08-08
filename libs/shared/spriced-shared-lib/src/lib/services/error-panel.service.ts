import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ErrorPanelService {
  ERROR_LIST: BehaviorSubject<any[]> = new BehaviorSubject<
  any[]
>([]);

$ERROR_LIST = this.ERROR_LIST.asObservable();

init(): void {
  this.setErrors([]);
}

setErrors(errorList: any[]): void {
  this.ERROR_LIST.next(errorList);
}
getErrors() {
  return this.$ERROR_LIST;
}
}
