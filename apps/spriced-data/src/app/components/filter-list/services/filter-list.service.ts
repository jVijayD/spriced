import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Criteria, PageData, RequestUtilityService } from "@spriced-frontend/spriced-common-lib";

@Injectable({ providedIn: "root" })
export class FilterListService {
    api_url: string;

    constructor(
        private http: HttpClient,
        private requestUtility: RequestUtilityService
      ) {
        this.api_url = process.env["NX_API_DATA_URL"] as string;
      }
loadFilters(criteria:Criteria)
  {
    const url = this.requestUtility.addCriteria(
      `${this.api_url}/filter`,
      criteria
    );
    return this.http.get<PageData>(url);
  }
  addFilters(filter:any)
  {
    return this.http.post(`${this.api_url}/filter`, filter);
  }
  deleteFilter(id:number)
  {
    return this.http.delete(`${this.api_url}/filter/${id}`);
  }
  editFilter(filter:any)
  {
    return this.http.put(`${this.api_url}/filter`,filter);
  }
}