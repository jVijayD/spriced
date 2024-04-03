import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import {
  Criteria,
  PageData,
  RequestUtilityService,
} from "@spriced-frontend/spriced-common-lib";
import { Observable } from "rxjs";

@Injectable({ providedIn: "root" })
export class ValidationService {
  api_url: string;
  constructor(
    private http: HttpClient,
    private requestUtility: RequestUtilityService
  ) {
    this.api_url = process.env["NX_API_DATA_URL"] as string;
  }

  getFailedValidation(entityId:string,rowId:string) {
    
  return this.http.get(
      `${this.api_url}/entity/${entityId}/data/${rowId}/ruleValidations`
    );
  }

}
