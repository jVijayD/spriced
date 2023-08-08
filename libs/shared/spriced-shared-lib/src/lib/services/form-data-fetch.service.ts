import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, Inject } from '@angular/core';
import { of } from 'rxjs';

@Injectable()
export class FormDataFetchService {
  definition_api_url: any = '';
  data_api_url: any = '';

  constructor(@Inject('ENVIRONMENT') private env: any,
  private httpClient: HttpClient) {
    this.definition_api_url = env.DEFININTION_API_URL;
    this.data_api_url = env.DATA_API_URL
  }

   headers = new HttpHeaders()
  .set('tenant', 'meritor')
  .set('user', 'venmani@simadvisorypartner.com')
  .set('transactionId', 'AQWSIDSTWERTXWSATYYOKLMH')
  .set('roles', 'admin,manager,viewer')
  .set('applications', 'app1,app2,app3')
  .set('Access-Control-Allow-Origin', '*');

  getLookupData(id:number) {
        return ( this.httpClient.get(`${this.data_api_url}/entity/${id}/data`, { headers: this.headers }));
  }
}
