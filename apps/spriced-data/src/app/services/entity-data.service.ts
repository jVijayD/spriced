import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

@Injectable({ providedIn: "root" })
export class EntityDataService {
  api_url: string;
  constructor(private http: HttpClient) {
    this.api_url = process.env["NX_API_DATA_URL"] as string;
  }

  loadEntityData(id: string | number): Observable<any> {
    return this.http.get(`${this.api_url}/entity/${id}/data`);
  }

  createEntityData(id: string | number, data: any): Observable<any> {
    return this.http.post(`${this.api_url}/entity/${id}/data`, {
      data: [data],
    });
  }
  updateEntityData(id: string | number, data: any): Observable<any> {
    return this.http.put(`${this.api_url}/entity/${id}/data`, { data: [data] });
  }
  upload(file: any) {
    const headers = new HttpHeaders().set("Content-Type", "application/json");

    return this.http.post(`${this.api_url}/bulk/upload`, file, {
      headers: headers,
    });
  }
  getStatus() {
    return this.http.get(`${this.api_url}/bulk/getAll`);
  }
}
