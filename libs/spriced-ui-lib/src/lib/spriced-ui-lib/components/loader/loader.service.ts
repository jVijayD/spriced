import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
@Injectable({
  providedIn: "root",
})
export class LoaderService {
  visibility: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  counter = 0;

  public visibility$ = this.visibility.asObservable();
  show() {
    this.visibility.next(true);
    this.counter++;
  }

  hide() {
    this.counter--;
    if (this.counter == 0) {
      this.visibility.next(false);
    }
  }
}
