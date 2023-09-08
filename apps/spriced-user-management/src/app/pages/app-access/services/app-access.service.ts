import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import {
  AppPermissionsDTO
} from "../models/AppAccesTypes.class";

@Injectable({
  providedIn: "root",
})
export class AppAccessService {
  api_url: string;
  constructor(private http: HttpClient) {
    this.api_url = process.env["NX_API_USER-ACCESS_URL"] as string;
    this.api_url += "/user-access";
  }
  public getAppPermissions(id: any, role: string): Observable<AppPermissionsDTO[]> {
    return this.http
      .get(`${this.api_url}/permissions/${id}/${role}`)
      .pipe(Object.assign);
  }
  public saveAppAccessPermission(
    body: AppPermissionsDTO
  ): Observable<any> {
    return this.http.post(`${this.api_url}/permissions`, body, {
    });
  }
}
