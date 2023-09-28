import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Hierarchy } from "../models/HierarchyTypes.class";
import { map } from "rxjs";
import { Model } from "@spriced-frontend/spriced-common-lib";

@Injectable({
  providedIn: "root",
})
export class HierarchyServiceService {
  api_url: string;
  constructor(private http: HttpClient) {
    this.api_url = process.env["NX_API_DEFINITION_URL"] as string;
  }
  loadAllHierarchies(model:Model) {
    return this.http
      .get(`${this.api_url}/hierarchy/model/${model.id}`)
      .pipe(map((h) => h as Hierarchy[]));
  }
  loadHierarchy(hierarchy:Hierarchy) {
    return this.http
      .get(`${this.api_url}/hierarchy/${hierarchy.id}`)
      .pipe(map((h) => h as Hierarchy[]));
  }

  saveHierarchy(hierarchy: Hierarchy) {
    if (hierarchy.id == 0) {

      // return this.http.post(`${this.api_url}/entities`, body);
      return this.http.post(`${this.api_url}/hierarchy`,hierarchy).pipe(map((h) => h));;
    } else {
      return this.http.patch(
        `${this.api_url}/hierarchy/${hierarchy.id}`,
        hierarchy
      ).pipe(map((h) => h));;
    }
  }

  deleteHierarchy(hierarchy: Hierarchy){
    return this.http.delete(
      `${this.api_url}/hierarchy/${hierarchy.id}`
    ).pipe(map((h) => h));;
  }
}
