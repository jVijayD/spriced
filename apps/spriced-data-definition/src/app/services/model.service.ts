import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

@Injectable({ providedIn: "root" })
export class ModelService {
  api_url: string;
  constructor(private http: HttpClient) {
    this.api_url = process.env["NX_API_DEFINITION_URL"] as string;
  }

  add(model: any) {
    return this.http.post(`${this.api_url}/models`, model);
  }
  delete(id: number) {
    return this.http.delete(`${this.api_url}/models/${id}`);
  }
  edit(model: any, value: any) {
    return this.http.patch(`${this.api_url}/models/${value.id}`, {
      displayName: model.displayName,
      name: model.name,
      id: value.id,
    });
  }
  load(id: number) {
    return this.http.delete(`${this.api_url}/models/${id}`);
  }
  loadAllModels() {
    return this.http.get(`${this.api_url}/models`);
  }
}
