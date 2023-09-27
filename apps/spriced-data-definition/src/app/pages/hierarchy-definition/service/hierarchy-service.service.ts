import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Hierarchy } from "../models/HierarchyTypes.class";
import { map } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class HierarchyServiceService {
  api_url: string;
  constructor(private http: HttpClient) {
    this.api_url = process.env["NX_API_DEFINITION_URL"] as string;
  }
  loadAllHierarchies() {
    return this.http
      .get(`${this.api_url}/hierarchy`)
      .pipe(map((h) => h as Hierarchy[]));
  }
}
