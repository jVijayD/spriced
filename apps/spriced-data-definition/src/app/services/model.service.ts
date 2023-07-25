import {  HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {  Observable } from 'rxjs';
const headers = new HttpHeaders()
  .set('tenant', 'meritor')
  .set('user', 'anand.kumar@simadvisory.com')
  .set('transactionId', 'AQWSIDSTWERTXWSATYYOKLMH')
  .set('roles', 'admin,manager,viewer')
  .set('applications', 'app1,app2,app3')
  .set('Access-Control-Allow-Origin', '*');
@Injectable()
export class ModelService {
    api_url:string
    constructor(
        
        private http: HttpClient
      ) {
      
        this.api_url = process.env["NX_API_DEFINITION_URL"]as string;
      }
    public createModel(body: any): Observable<any> {
        console.log(body);
        console.log(this.api_url)
        return this.http.post(`${this.api_url}/models`, body, {
          headers: headers,
        });
      }
}
