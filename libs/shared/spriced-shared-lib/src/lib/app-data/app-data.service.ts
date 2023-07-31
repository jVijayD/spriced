import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, fromEvent, map, merge, of } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class AppDataService {
  private userData = new BehaviorSubject<UserData | null>(null);
  private menuData = new BehaviorSubject<MenuItem[]>([]);
  networkStatus$ = new Observable<boolean>();

  userData$ = this.userData.asObservable();
  menuData$ = this.menuData.asObservable();

  constructor() {}

  setUserData(user: UserData) {
    this.userData.next(user);
  }

  setMenuData(menuItems: MenuItem[]) {
    this.menuData.next(menuItems);
  }

  setNetworkAccessData() {
    this.networkStatus$ = merge(
      of(null),
      fromEvent(window, "online"),
      fromEvent(window, "offline")
    ).pipe(map(() => navigator.onLine));
  }
}

export interface UserData {
  userId: string;
  username: string;
  displayName: string;
  token: string;
}

export interface MenuItem {
  name: string;
  path: string;
  active: boolean;
  items?: MenuItem[];
}
