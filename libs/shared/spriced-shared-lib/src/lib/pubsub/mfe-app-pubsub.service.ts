import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root",
})
export class MfeAppPubSubService {
  public publish<T>(name: string, data: T) {
    const event = new CustomEvent<T>(name, {
      detail: data,
    });
    window.dispatchEvent(event);
  }

  public subscribe(name: string, listener: EventListenerOrEventListenerObject) {
    window.addEventListener(name, listener);
  }
}
