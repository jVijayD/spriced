import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class AppDataService {
  private userData = new BehaviorSubject<any>(null);
  private menuData = new BehaviorSubject<any>(null);
  userData$ = this.userData.asObservable();
  menuData$ = this.menuData.asObservable();
  constructor() {}
}

export interface UserData {}

export interface MenuData {}
