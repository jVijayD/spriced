import { Injectable } from "@angular/core";
import { UserAccessService } from "@spriced-frontend/spriced-common-lib";
import {
  BehaviorSubject,
  Observable,
  fromEvent,
  map,
  merge,
  of,
} from "rxjs";

@Injectable({
  providedIn: "root",
})
export class AppDataService {
  private userData = new BehaviorSubject<UserData | null>(null);
  private menuData = new BehaviorSubject<MenuItem[]>([]);
  private appDataSubject = new BehaviorSubject<Application[] | null>([]);
  ERROR_LIST: BehaviorSubject<errorElement[]> = new BehaviorSubject<errorElement[]>([]);
  networkStatus$ = new Observable<boolean>();
  public subConditionForm = new BehaviorSubject<any>(null);

  userData$ = this.userData.asObservable();
  menuData$ = this.menuData.asObservable();
  $ERROR_LIST = this.ERROR_LIST.asObservable();
  hasAppsLoaded = false;
  constructor(private userAccessService: UserAccessService) {
    console.log("a");
  }

  setUserData(user: UserData) {
    this.userData.next(user);
  }
  setApps(apps: Application[]) {
    this.appDataSubject.next(apps);
    this.hasAppsLoaded = true;
  }
  getApps() {
    if (!this.hasAppsLoaded) {
      this.userAccessService.loadAllApps().subscribe((appsList) => {
        this.setApps(appsList.map((a) => a as Application));
      });
    }
    return this.appDataSubject.asObservable();
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

  setErrors(errorList: errorElement[]): void {
    this.ERROR_LIST.next(errorList);
  }

  getErrors() {
    return this.$ERROR_LIST;
  }

  init() {
    this.setErrors([]);
  }
}

export interface errorElement {
  type: ErrorTypes;
  cmp?: string;
  msg: string;
}

export enum ErrorTypes {
  ERROR = "Error",
  WARNING = "Warning",
}

export interface UserData {
  userId: string;
  username: string;
  displayName: string;
  token: string;
}
export interface Application {
  code: string;
  description: string;
  icon: string;
  id: number;
  name: string;
  path: string;
  status: boolean;
}

export interface MenuItem {
  name: string;
  path: string;
  active: boolean;
  items?: MenuItem[];
}
