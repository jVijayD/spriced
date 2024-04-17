import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

@Injectable({ providedIn: "root" })
export class ReportService {
  api_url: string;
  constructor(
    private http: HttpClient,
  ) {
    this.api_url = process.env["NX_API_DEFINITION_URL"] as string;
  }
  public getReports(): Observable<any> {
    return this.http.get(`assets/data/reports.json`);
  }
}
