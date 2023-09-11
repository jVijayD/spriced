import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject, of } from 'rxjs';
import { Entity, Rule, conditionTypes, dataTypes, modelData, operandType, operatorType } from '../models/buisnessrule';

@Injectable({
  providedIn: 'root'
})
export class BusinessruleService {
  public ruleChageDetection = new Subject();
  public apiUrl: any = '';

  constructor(
    private http: HttpClient
  ) {
    this.apiUrl = process.env['NX_API_DEFINITION_URL'];
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
  public saveBusinessRule(params: any): Observable<Rule[]> 
  {
    return this.http.post<Rule[]>(`${this.apiUrl}/rules/save`, params);
  }

   /**
   * HANDLE THIS FUNCTION FOR UPDATE SAVE THE BUSINESS RULE DATA
   * @param params any
   * @returns 
   */
   public updateSaveBusinessRule(ruleId: number, params: any): Observable<Rule[]> 
   {
     return this.http.put<Rule[]>(`${this.apiUrl}/rules/save/${ruleId}`, params);
   }
}
