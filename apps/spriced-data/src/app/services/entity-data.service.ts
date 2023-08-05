import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class EntityDataService {
  private api_url = "";
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
}
