import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import {
  Criteria,
  PageData,
  RequestUtilityService,
} from "@spriced-frontend/spriced-common-lib";
import { Observable } from "rxjs";

@Injectable({ providedIn: "root" })
export class EntityDataService {
  api_url: string;
  constructor(
    private http: HttpClient,
    private requestUtility: RequestUtilityService
  ) {
    this.api_url = process.env["NX_API_DATA_URL"] as string;
  }

  upload(file: any, fileDetails: any) {
    return this.http.post(`${this.api_url}/bulk/upload`, file);
  }
  loadEntityData(
    id: string | number,
    criteria: Criteria
  ): Observable<PageData> {
    const url = this.requestUtility.addCriteria(
      `${this.api_url}/entity/${id}/data`,
      criteria
    );
    return this.http.get<PageData>(url);
  }

  createEntityData(id: string | number, data: any): Observable<any> {
    return this.http.post(`${this.api_url}/entity/${id}/data`, {
      data: [data],
    });
  }
  updateEntityData(id: string | number, data: any): Observable<any> {
    return this.http.put(`${this.api_url}/entity/${id}/data`, { data: [data] });
  }
  deleteEntityData(id: string | number, entityDataId: number): Observable<any> {
    return this.http.delete(
      `${this.api_url}/entity/${id}/data/${entityDataId}`
    );
  }

  getStatus() {
    return this.http.get(`${this.api_url}/bulk/getAll`);
  }
}
