import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Criteria, PageData, RequestUtilityService } from '@spriced-frontend/spriced-common-lib';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class TransactionsService {
  api_url: string;
  def_url: string;
  constructor(
    private http: HttpClient,
    private requestUtility: RequestUtilityService
  ) {
    this.api_url = process.env["NX_API_DATA_URL"] as string;
    this.def_url = process.env["NX_API_DEFINITION_URL"] as string;
  }



  loadTransactionsData(criteria: Criteria): Observable<PageData> {
    const url = this.requestUtility.addCriteria(
      `${this.api_url}/audit-trial`,
      criteria
    );
    return this.http.get<PageData>(url);
  }
  auditReversal(data: any,criteria:Criteria): Observable<any> {
    return this.http.put(`${this.api_url}/audit-trial/${data.entityId}/data?criteria=${encodeURI(JSON.stringify(criteria))}`, {
      "id": data.id,
      "entity_name": data.entityName,
      "column_name": data.columnName,
      "prior_value": data.priorValue,
      "new_value": data.newValue,
      "action": data.action,
      "transaction_type": data.transactionType,
      "annotations": data.annotations,
      "record_id": data.recordId,
      "dataType": data.dataType,
      "group_id": data.groupId
    });
  }
}
