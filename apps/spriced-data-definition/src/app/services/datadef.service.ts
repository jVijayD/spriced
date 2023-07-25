import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { EntityDTO } from '../pages/model-access/models/ModelAccesTypes.class';
const headers = new HttpHeaders()
  .set('tenant', 'meritor')
  .set('user', 'anand.kumar@simadvisory.com')
  .set('transactionId', 'AQWSIDSTWERTXWSATYYOKLMH')
  .set('roles', 'admin,manager,viewer')
  .set('applications', 'app1,app2,app3')
  .set('Access-Control-Allow-Origin', '*');

@Injectable()
export class DataDefListService {
  api_url = 'http://localhost:8080';
  private currentEntity: BehaviorSubject<any>;
  constructor(private http: HttpClient) {
    this.currentEntity = new BehaviorSubject<any | null>(null);
  }
  setCurrentEntity(currentEntity: any) {
    this.currentEntity.next(currentEntity);
  }
  getCurrentEntity() {
    return this.currentEntity.value;
  }
  public getModels(): Observable<any> {
    return this.http.get(`${this.api_url}/models`, { headers: headers });
  }
  public createModel(body: any): Observable<any> {
    console.log(body);
    return this.http.post(`${this.api_url}/models`, body, {
      headers: headers,
    });
  }
  public deleteModel(id: any): Observable<any> {
    return this.http.delete(`${this.api_url}/models/${id}`, {
      headers: headers,
    });
  }
  public updateModel(body: any): Observable<any> {
    return this.http.patch(`${this.api_url}/models/${body.id}`, body, {
      headers: headers,
    });
  }
  public getEntities(id: any): Observable<EntityDTO[]> {
    return this.http.get(`${this.api_url}/models/${id}/entities`, {
      headers: headers,
    }).pipe(Object.assign);;
  }
  public createEntity(body: any): Observable<any> {
    return this.http.post(`${this.api_url}/entities`, body, {
      headers: headers,
    });
  }
  public deleteEntity(id: any): Observable<any> {
    return this.http.delete(`${this.api_url}/entities/${id}`, {
      headers: headers,
    });
  }
  public updateEntity(body: any): Observable<any> {
    return this.http.put(`${this.api_url}/entities/${body.id}`, body, {
      headers: headers,
    });
  }
}
