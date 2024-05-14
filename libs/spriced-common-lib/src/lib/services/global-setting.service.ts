import { Injectable } from "@angular/core";
import { NgxIndexedDBService } from "ngx-indexed-db";
import { Observable, map } from "rxjs";
import { currentStorage } from "./generic-storage.service";
import {
  PageData,
  RequestUtilityService,
} from "./utility/request-utility.service";
import { HttpClient } from "@angular/common/http";
import * as moment from "moment-timezone";

@Injectable({
  providedIn: "root",
})
export class GlobalSettingService {
  api_url: string;
  constructor(
    private dbService: NgxIndexedDBService,
    private http: HttpClient,

    private requestUtility: RequestUtilityService
  ) {
    this.api_url = process.env["NX_API_DATA_URL"] as string;
  }

  getGlobalSettings(): Observable<PageData> {
    let criteria: any = {
      filters: [
        {
          filterType: "CONDITION",
          joinType: "AND",
          operatorType: "EQUALS",
          key: "type",
          value: "global",
          dataType: "string",
        },
      ],
      pager: {},
      sorters: [],
    };
    const url = this.requestUtility.addCriteria(
      `${this.api_url}/settings`,
      criteria
    );
    return this.http.get<PageData>(url);
  }

  getCurrentSettings(entity: string) {
    let ent: any = localStorage.getItem(entity);
    return JSON.parse(ent);
    // return this.dbService.getAll("this_entity").pipe(
    //   map((res: any) => {
    //     let resp;
    //     res.map((value: any) => {
    //       if (value.entity == entity) {
    //         resp = value;
    //       }
    //     });
    //     return resp;
    //   })
    // );
  }

  getCurrentStorage(key: string): currentStorage {
    let item: any = localStorage.getItem(key);
    return JSON.parse(item);
  }

  setCurrentStorage(key: string, currentObject: any) {
    localStorage.setItem(key, JSON.stringify(currentObject));
  }
  setSettings(value: any) {
    if (value.id) {
      return this.http.put(`${this.api_url}/settings`, value);
    } else {
      return this.http.post(`${this.api_url}/settings`, value);
    }
  }
  putSettings(value: string) {
    return this.http.put(`${this.api_url}/settings`, value);
  }
  setTimezone(data: any) {
    localStorage.setItem("timezone", data);
    if (data !== "normal") { moment.tz.setDefault() } else { moment.tz.setDefault() };
  }
}
