import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { EntityDTO, RoleGroupPermissionMapping } from "../models/ModelAccesTypes.class";

const headers = new HttpHeaders()
  .set("tenant", "meritor")
  .set("user", "anand.kumar@simadvisory.com")
  .set("transactionId", "AQWSIDSTWERTXWSATYYOKLMH")
  .set("roles", "admin,manager,viewer")
  .set("applications", "app1,app2,app3")
  .set("Access-Control-Allow-Origin", "*");
@Injectable({
  providedIn: "root",
})
export class ModelAccessService {
  constructor(private http: HttpClient) {}
  headers = new HttpHeaders()
    .set("tenant", "meritor")
    .set("user", "anand.kumar@simadvisory.com")
    .set("transactionId", "AQWSIDSTWERTXWSATYYOKLMH")
    .set("roles", "admin,manager,viewer")
    .set("applications", "app1,app2,app3")
    .set("Access-Control-Allow-Origin", "*");
  api_url = process.env["NX_API_DEFINITION_URL"] as string;
  getRoles() {
    return [
      { name: "admin" },
      { name: "manager" },
      { name: "view" }
    ];
  }
  public getEntities(id: any,role: string): Observable<EntityDTO[]> {
    return this.http
      .get(`${this.api_url}/models/${id}/entities`, {
        headers: headers,
        params:{roleName:role}
      })
      .pipe(Object.assign);
  }
  public getModels(): Observable<any> {
    return this.http.get(`${this.api_url}/models`, { headers: headers });
  }
  public saveModelAccessPermission(
    body: RoleGroupPermissionMapping
  ): Observable<any> {
    return this.http.post(`${this.api_url}/accessmanagement`, body, {
      headers: headers,
    });
  }
}
