import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, Subject, of, tap } from 'rxjs';
import { LRUCache } from "typescript-lru-cache";
import { Criteria, PageData, RequestUtilityService, } from "@spriced-frontend/spriced-common-lib";
import { Entity, Rule, conditionTypes, dataTypes, modelData, operandType, operatorType } from '../models/buisnessrule';

@Injectable({
  providedIn: 'root'
})
export class BusinessruleService {
  public ruleChageDetection = new BehaviorSubject<any>(null);
  public apiUrl: any = '';
  public data_url: string;

  constructor(
    private http: HttpClient,
    private requestUtility: RequestUtilityService,
  ) {
    this.apiUrl = process.env['NX_API_DEFINITION_URL'];
    this.data_url = process.env["NX_API_DATA_URL"] as string;
  }

  /**
   * HANDLE THIS FUNCTION FOR GET RULES
   * @returns 
   */
  public getAllRules(): Observable<Rule[]> {
    return this.http.get<Rule[]>(`${this.apiUrl}/rules`);
  }

  /**
   * HANDLE THIS FUNCTION FOR GET RULES BY ID
   * @param id number
   * @returns 
   */
  public getAllRulesById(id: number): Observable<Rule[]> {
    return this.http.get<Rule[]>(`${this.apiUrl}/rules/${id}`);
  }

  /**
   * HANDLE FOR UPDATE THE RULE BY ID
   * @param ruleId nu,ber
   * @param params any
   * @returns 
   */
  public updateBusinessRule(ruleId: number, params: any): Observable<Rule[]> {
    return this.http.put<Rule[]>(`${this.apiUrl}/rules/${ruleId}`, params);
  }

  /**
   * HANDLE THIS FUNCTION FOR GET MODELS
   * @returns 
   */
  public getAllModles(): Observable<modelData> {
    return this.http.get<modelData>(`${this.apiUrl}/models`);
  }

  /**
  * HANDLE THIS FUNCTION FOR GET CONDITIONS
  * @returns 
  */
  public getAllConditionsTypes(): Observable<conditionTypes> {
    return this.http.get<conditionTypes>(`${this.apiUrl}/master-data/condition-types`);
  }

  /**
 * HANDLE THIS FUNCTION FOR GET OPERATORS
 * @returns 
 */
  public getAllOperatorsTypes(): Observable<operatorType> {
    return this.http.get<operatorType>(`${this.apiUrl}/master-data/operator-types`);
  }

  /**
   * 
   * @returns HANDLE THIS API FOR GET ALL DATA TYPES
   */
  public getAllDataTypes(): Observable<dataTypes> {
    return this.http.get<dataTypes>(`${this.apiUrl}/master-data/data-types`);
  }

  /**
* HANDLE THIS FUNCTION FOR GET OPERANDS
* @returns 
*/
  public getAllOperandsTypes(): Observable<operandType> {
    return this.http.get<operandType>(`${this.apiUrl}/master-data/operand-types`);
  }

  /**
   * HANDLE THIS FUNCTION FOR ENTITIES
   * @param id number
   * @returns 
   */
  public getAllEntitesByModuleId(id: number) {
    return this.http.get(`${this.apiUrl}/models/${id}/entities`);
  }

  /**
   * HANDLE THIS FUNCTION FOR ENTITIES BY ID
   * @param id number
   * @returns 
   */
  public getAllEntitesById(id: number): Observable<Entity[]> {
    return this.http.get<Entity[]>(`${this.apiUrl}/entities/${id}`);
  }

  /**
   * HANDLE THIS FUNCTION FOR GET ALL BUSINESSRULEMANAGEMENT DATA
   * @returns 
   */
  public getConditionsData(): Observable<any> {
    return this.http.get(`assets/businessrulemanagement.json`);
  }

  /**
   * HANDLE THIS FUNCTION FOR SAVE THE BUSINESS RULE DATA
   * @param params any
   * @returns 
   */
  public insertBusinessRule(params: any): Observable<Rule[]> {
    return this.http.post<Rule[]>(`${this.apiUrl}/rules`, params);
  }

  /**
   * HANDLE THIS FUNCTION FOR DELETE THE RULE BY ID
   * @param id number
   * @returns 
   */
  public deleteBusinessRule(id: number) {
    return this.http.delete(`${this.apiUrl}/rules/${id}`);
  }

  /**
   * HANDLE THIS FUNCTION FOR SAVE THE BUSINESS RULE DATA
   * @param params any
   * @returns 
   */
  public saveBusinessRule(params: any): Observable<Rule[]> {
    return this.http.post<Rule[]>(`${this.apiUrl}/rules/save`, params);
  }

  /**
  * HANDLE THIS FUNCTION FOR UPDATE SAVE THE BUSINESS RULE DATA
  * @param params any
  * @returns 
  */
  public updateSaveBusinessRule(ruleId: number, params: any): Observable<Rule[]> {
    return this.http.put<Rule[]>(`${this.apiUrl}/rules/save/${ruleId}`, params);
  }

  /**
   * HANDLE THIS FUNCTION FOR LOAD LOOKUPDATA
   * @param id number
   * @returns 
   */
  loadLookupData(id: string | number, pageNumber: number = 0, pageSize: number = 20000): Observable<PageData> {
    const criteria: Criteria = {
      pager: {
        pageSize,
        pageNumber,
      },
    };
    const headers = new HttpHeaders().set("no-loader", "true");

    const url = this.requestUtility.addCriteria(
      `${this.data_url}/entity/${id}/data?lookup=true`,
      criteria,
      false
    );
    return this.http.get<PageData>(url, {
      headers: headers,
    });
  }
}
