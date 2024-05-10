import { Inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { WebSocketSubject, webSocket } from "rxjs/webSocket";

@Injectable({
  providedIn: "root",
})
export class WebsocketUtilityService {
  connect(url: string): WebSocketSubject<any> {
    const webSocketSubject: WebSocketSubject<any> = webSocket(url);
    return webSocketSubject;
  }

  sendMessage(webSocketSubject: WebSocketSubject<any>, message: any): void {
    webSocketSubject.next(message);
  }

  closeConnection(webSocketSubject: WebSocketSubject<any>): void {
    webSocketSubject.complete();
  }
}
