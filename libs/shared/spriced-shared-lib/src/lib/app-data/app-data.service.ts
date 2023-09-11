import { Injectable } from "@angular/core";
import { UserAccessService } from "@spriced-frontend/spriced-common-lib";
import { BehaviorSubject, Observable,Subject, fromEvent, map, merge, of } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class AppDataService {
  private userData = new BehaviorSubject<UserData | null>(null);
  private menuData = new BehaviorSubject<MenuItem[]>([]);
  private appData = new BehaviorSubject<Application[]>([]);
  private apps$ = this.appData.asObservable();
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
    this.appData.next(apps);
  }
  getApps() {
    if (!this.hasAppsLoaded) {
      this.userAccessService.loadAllApps().subscribe((appsList) => {
        let appsAry = appsList.map((a) => a as Application);
        this.setApps(appsAry);
        this.hasAppsLoaded = true;
      });
    }
    return this.apps$;
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
