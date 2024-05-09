import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import {
  Criteria,
  PageData,
  RequestUtilityService,
} from "../../index";
import { BehaviorSubject, Observable, map, of, tap } from "rxjs";
import { saveAs } from "file-saver";
import { LRUCache } from "typescript-lru-cache";
const DEFAULT_LOOKUP_PAGE_SIZE = 100;
const cacheOptions = {
  maxSize: 500,
  entryExpirationTimeInMS: 60 * 1000 * 30,
};

@Injectable({
  providedIn: 'root'
})
export class DataEntityService {
  api_url: string;
  def_url: string;
  cache: LRUCache;
  filterDataByHierarchy = new BehaviorSubject<any>(null);

  constructor(
    private http: HttpClient,
    private requestUtility: RequestUtilityService
  ) {
    this.api_url = process.env["NX_API_DATA_URL"] as string;
    this.def_url = process.env["NX_API_DEFINITION_URL"] as string;
    this.cache = new LRUCache(cacheOptions);
  }

  upload(file: any, fileDetails: any) {
    return this.http.post(`${this.api_url}/bulk/upload`, file);
  }

  loadEntityData(
    id: string | number,
    criteria: Criteria
  ): Observable<PageData> {
    const url = this.requestUtility.addCriteria(
      `${this.api_url}/entity/${id}/data`,
      criteria
    );
    return this.http.get<PageData>(url);
  }

  loadEntityDataArray(
    id: string | number,
    criteria: Criteria
  ): Observable<PageData> {
    const url = this.requestUtility.addCriteria(
      `${this.api_url}/entity/${id}/data/json/items`,
      criteria
    );
    return this.http.get<PageData>(url).pipe(
      map((page) => {
        const content =
          page.content && page.content.length
            ? JSON.parse(page.content[0])
            : [];
        return { ...page, content: this.createRows(content) };
      })
    );
  }

  exportToExcel(id: string | number, filename: string, criteria: Criteria) {
    const url = this.requestUtility.addCriteria(
      `${this.api_url}/entity/${id}/export/excel`,
      criteria
    );

    return this.http
      .get(url, {
        responseType: "blob",
      })
      .subscribe((blob) => {
        let data = new Blob([blob], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });
        saveAs(data, filename);
      });
    /*{
  responseType: 'blob'
}*/
  }

  private createRows(content: any) {
    const records = content.records || [];
    const fields = content.fields || [];

    return records.map((row: any[]) => {
      let obj: any = {};
      row.forEach((col, index) => {
        const propName = fields[index].name;
        obj[propName] = col;
      });
      return obj;
    });
  }

  loadAuditData(entityName: string, criteria: Criteria): Observable<PageData> {
    const url = this.requestUtility.addCriteria(
      `${this.api_url}/audit-trial`,
      criteria
    );
    return this.http.get<PageData>(url);
  }

  loadValidationMessage(item:any): Observable<PageData> {
    const url = this.requestUtility.addCriteria(
      `${this.api_url}/entity/validations`,
    );
    return this.http.get<PageData>(url);
  }

  loadAnnotations(id:number,criteria:Criteria):Observable<PageData>{
    const url = this.requestUtility.addCriteria(`${this.api_url}/audit-trial/annotation`,
    criteria
    );
    return this.http.get<PageData>(url);
  }

  addAnnotations(id: string | number, annotation: any): Observable<any> {
    let annotations={"annotations":annotation}
    return this.http.put(`${this.api_url}/audit-trial/annotation/${id}`,{annotations:annotations});
  }

  loadLookupData(
    id: string | number,
    pageNumber: number = 0,
    pageSize: number = DEFAULT_LOOKUP_PAGE_SIZE,
    filters: any,
    sorters:any
  ): Observable<PageData> {
    const criteria: Criteria = {
      pager: {
        pageSize,
        pageNumber,
      },
      filters: filters,
      sorters:sorters
    };
    const headers = new HttpHeaders().set("no-loader", "true");
    const url = this.requestUtility.addCriteria(
      `${this.api_url}/entity/${id}/data/lookup?lookup=true`,
      criteria,
      false
    );

    let data = this.cache.get(url);
    if (data) {
      return of(data);
    } else {
      return this.requestUtility.get(url, headers).pipe(
        tap((items) => {
          this.cache.set(url, items);
        })
      );
    }

    //return this.requestUtility.get(url, headers);
  }

  createEntityData(id: string | number, data: any): Observable<any> {
    return this.http.post(`${this.api_url}/entity/${id}/data`, {
      data: [data],
    });
  }
  updateEntityData(id: string | number, data: any): Observable<any> {
    return this.http.put(`${this.api_url}/entity/${id}/data`, { data: [data] });
  }
  deleteEntityData(id: string | number, entityDataId: number): Observable<any> {
    return this.http.delete(
      `${this.api_url}/entity/${id}/data/${entityDataId}`
    );
  }
  getRelatedEntity(groupId: any, entityId: any) {
    return this.http.get(
      `${this.def_url}/models/${groupId}/entities/${entityId}/related`
    );
  }
  getStatus() {
    return this.http.get(`${this.api_url}/bulk/getAll`);
  }

  loadEntity(id: number): Observable<any> {
    return this.http.get(`${this.def_url}/entities/${id}`);
  }

  loadHierarchy(id: any) {
    return this.http
      .get(`${this.def_url}/hierarchy/${id}`)
      .pipe(map((h) => h as any[]));
  }

  updateHierarchy(param: any) {
    return this.http.patch(
      `${this.def_url}/hierarchy/updateParent`, param);
  }
}