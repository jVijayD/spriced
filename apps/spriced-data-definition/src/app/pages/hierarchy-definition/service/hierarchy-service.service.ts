import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Hierarchy, permissions } from "../models/HierarchyTypes.class";
import { Observable, map } from "rxjs";
import { Criteria, Model, PageData, RequestUtilityService } from "@spriced-frontend/spriced-common-lib";

@Injectable({
  providedIn: "root",
})
export class HierarchyServiceService {
  api_url: string;
  apiData_url: string;
  constructor(private http: HttpClient, private requestUtility: RequestUtilityService) {
    this.apiData_url = process.env["NX_API_DATA_URL"] as string;
    this.api_url = process.env["NX_API_DEFINITION_URL"] as string;
  }
  loadAllHierarchies(model: Model) {
    return this.http
      .get(`${this.api_url}/hierarchy/model/${model.id}`)
      .pipe(map((h) => h as Hierarchy[]));
  }
  loadHeirarchysummaryByModelId(model:Model,role:any,criteria:Criteria){
    const url = this.requestUtility.addCriteria(`${this.api_url}/hierarchy/getPermissionSummary/${model.id}/${role}`,criteria)
     return this.http.get<PageData>(url);
   
  }
  loadHierarchy(hierarchy: Hierarchy) {
    return this.http
      .get(`${this.api_url}/hierarchy/${hierarchy.id}`)
      .pipe(map((h) => h as Hierarchy[]));
  }
  
  loadHierarchyByPermissions(params:permissions){
    const url = `${this.api_url}/hierarchy/setPermission`
    return this.http.post<PageData>(url,params)
  }

  saveHierarchy(hierarchy: Hierarchy) {
    if (hierarchy.id == 0) {

      // return this.http.post(`${this.api_url}/entities`, body);
      return this.http.post(`${this.api_url}/hierarchy`, hierarchy).pipe(map((h) => h));;
    } else {
      return this.http.patch(
        `${this.api_url}/hierarchy/${hierarchy.id}`,
        hierarchy
      ).pipe(map((h) => h));;
    }
  }

  deleteHierarchy(hierarchy: Hierarchy) {
    return this.http.delete(
      `${this.api_url}/hierarchy/${hierarchy.id}`
    ).pipe(map((h) => h));;
  }




  loadEntityData(
    id: string | number,
    criteria: Criteria
  ): Observable<PageData> {
    const url = this.requestUtility.addCriteria(
      `${this.apiData_url}/entity/${id}/data`,
      criteria
    );
    return this.http.get<PageData>(url);
  }
}
