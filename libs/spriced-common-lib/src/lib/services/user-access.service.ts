import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

@Injectable({ providedIn: "root" })
export class UserAccessService {
  api_url: string;
  constructor(private http: HttpClient) {
    this.api_url = process.env["NX_API_USER-ACCESS_URL"] as string;
    this.api_url += "/user-access";
  }

  // add(model: any) {
  //   return this.http.post(`${this.api_url}/roles`, model);
  // }
  // delete(id: number) {
  //   return this.http.delete(`${this.api_url}/roles/${id}`);
  // }
  // edit(model: any, value: any) {
  //   return this.http.patch(`${this.api_url}/roles/${value.id}`, {
  //     displayName: model.displayName,
  //     name: model.name,
  //     id: value.id,
  //   });
  // }
  // load(id: number) {
  //   return this.http.delete(`${this.api_url}/roles/${id}`);
  // }
  loadAllRoles() {
    return this.http.get<string[]>(`${this.api_url}/roles`);
  }

  // loadPageModels(pageNo: number, pageSize: number) {
  //   return this.http.get(
  //     `${this.api_url}/models?pageNo=${pageNo}&&pageSize=${pageSize}`
  //   );
  // }
}
