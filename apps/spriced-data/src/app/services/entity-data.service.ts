import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";

@Injectable({ providedIn: "root" })
export class EntityDataService {
  api_url: string;
  constructor(private http: HttpClient) {
    this.api_url = process.env["NX_API_DATA_URL"] as string;
  }

  upload(file: any, fileDetails: any) {
    return this.http.post(`${this.api_url}/bulk/upload`, file);
  }
  getStatus() {
    return this.http.get(`${this.api_url}/bulk/getAll`);
  }
}
