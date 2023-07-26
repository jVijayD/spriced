import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
const headers = new HttpHeaders()
  .set("tenant", "meritor")
  .set("user", "anand.kumar@simadvisory.com")
  .set("transactionId", "AQWSIDSTWERTXWSATYYOKLMH")
  .set("roles", "admin,manager,viewer")
  .set("applications", "app1,app2,app3")
  .set("Access-Control-Allow-Origin", "*");
@Injectable({ providedIn: "root" })
export class ModelService {
  api_url: string;
  constructor(private http: HttpClient) {
    this.api_url = process.env["NX_API_DEFINITION_URL"] as string;
  }

  add(model: any) {
    return this.http.post(`${this.api_url}/models`, model, {
      headers: headers,
    });
  }
  delete(id: number) {
    return this.http.delete(`${this.api_url}/models/${id}`, {
      headers: headers,
    });
  }
  edit(model: any, value: any) {
    return this.http.patch(
      `${this.api_url}/models/${value.id}`,
      { displayName: model.displayName, name: model.name, id: value.id },
      {
        headers: headers,
      }
    );
  }
  load(id: number) {
    return this.http.delete(`${this.api_url}/models/${id}`, {
      headers: headers,
    });
  }
  loadAllModels() {
    return this.http.get(`${this.api_url}/models`, { headers: headers });
  }
}
