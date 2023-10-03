import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';


@Injectable({
  providedIn: 'root'
})
export class TransactionsService {
  api_url: string;
  def_url: string;
  constructor(
    private http: HttpClient,
  ){
  this.api_url = process.env["NX_API_DATA_URL"] as string;
  this.def_url = process.env["NX_API_DEFINITION_URL"] as string;
  }
  

 
  // loadTransactionData(entityName: string, criteria: Criteria): Observable<PageData> {
  //   const url = this.requestUtility.addCriteria(
  //     `${this.api_url}/audit-trial`,
  //     criteria
  //   );
  //   return this.http.get<PageData>(url);
  // }
}

