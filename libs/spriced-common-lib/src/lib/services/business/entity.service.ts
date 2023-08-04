import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

@Injectable({ providedIn: "root" })
export class EntityService {
  api_url: string;
  constructor(private http: HttpClient) {
    this.api_url = process.env["NX_API_DEFINITION_URL"] as string;
  }

  add(body: any) {
    return this.http.post(`${this.api_url}/entities`, body);
  }
  delete(id: number) {
    return this.http.delete(`${this.api_url}/entities/${id}`);
  }
  edit(entity: any) {
    return this.http.patch(`${this.api_url}/entities/${entity.id}`, entity);
  }
  load(id: number) {
    return this.http.delete(`${this.api_url}/entities/${id}`);
  }
  loadEntityByModel(id: number) {
    return this.http.get(`${this.api_url}/models/${id}/entities`);
  }
}

export interface entity {}
