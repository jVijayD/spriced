import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import {
  Criteria,
  PageData,
  RequestUtilityService,
} from "@spriced-frontend/spriced-common-lib";
import { Observable } from "rxjs";

@Injectable({ providedIn: "root" })
export class SettingsService {
  api_url: string;
  constructor(
    private http: HttpClient,
    private requestUtility: RequestUtilityService
  ) {
    this.api_url = process.env["NX_API_DATA_URL"] as string;
  }

  getGlobalSettings(): Observable<PageData> {
    // let ent: any = localStorage.getItem("all_entity");
    // return ent
    //   ? JSON.parse(ent)
    //   : { displayFormat: "namecode", showSystem: false };

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

  getCurrentSettings(entity: any) {
    // let ent: any = localStorage.getItem(entity);
    // return JSON.parse(ent);
    let criteria: any = {
      filters: [
        {
          filterType: "CONDITION",
          joinType: "AND",
          operatorType: "EQUALS",
          key: "type",
          value: "entity",
          dataType: "string",
        },
        {
          filterType: "CONDITION",
          joinType: "AND",
          operatorType: "EQUALS",
          key: "entity_id",
          value: entity.id,
          dataType: "number",
        },
        {
          filterType: "CONDITION",
          joinType: "AND",
          operatorType: "EQUALS",
          key: "group_id",
          value: entity.groupId,
          dataType: "number",
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

  setSettings(value: string) {
    // localStorage.setItem(entity, JSON.stringify(value));
    return this.http.post(`${this.api_url}/settings`, value);
  }
  putSettings(value: string) {
    // localStorage.setItem(entity, JSON.stringify(value));
    return this.http.put(`${this.api_url}/settings`, value);
  }
}
