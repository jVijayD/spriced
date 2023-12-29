import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, Subject, first } from "rxjs";

@Injectable({ providedIn: "root" })
export class RequestUtilityService {
  private urlCache = new Map<string, Subject<any>>();
  constructor(private httpClient: HttpClient) {}

  public get(url: string, headers: any): Observable<any> {
    let data = this.urlCache.get(url);
    if (!data) {
      let urlSubject = new Subject<any>();
      this.urlCache.set(url, urlSubject);
      this.httpClient
        .get(url, headers)
        .pipe(first())
        .subscribe({
          next: (item) => {
            urlSubject.next(item);
            this.urlCache.delete(url);
          },
        });
    }
    return this.urlCache.get(url) as Subject<any>;
    //return urlSubject.asObservable();
  }

  public addCriteria(
    url: string,
    criteria?: Criteria,
    isFirst: boolean = true
  ) {
    let appendedUrl = "";
    if (criteria) {
      criteria.filters = criteria.filters ?? [];
      criteria.sorters = criteria.sorters ?? [];
      criteria.pager = criteria.pager ?? { pageNumber: 0, pageSize: 10 };
      appendedUrl = `${url}${isFirst ? "?" : "&"}criteria=${encodeURI(
        JSON.stringify(criteria)
      )}`;
    } else {
      appendedUrl = url;
    }

    return appendedUrl;
  }
}

export interface Criteria {
  filters?: any[];
  sorters?: { direction: "DESC" | "ASC"; property: string }[];

  pager?: {
    pageNumber: number;
    pageSize: number;
  };
}

export interface currentStorage {
  filters?: any[];
  sorters?: { direction: "DESC" | "ASC"; property: string }[];

  pager?: {
    pageNumber: number;
    pageSize: number;
  };
  modelId?: number|null;
  entityId?: number|null;
  attributeId?: string|null;
  hierarchyId?: number|null;
  role?: any;
}

export interface PageData {
  content: any[];
  pageable: {
    sort: {
      empty: boolean;
      unsorted: boolean;
      sorted: boolean;
    };
    offset: number;
    pageSize: number;
    pageNumber: number;
    paged: boolean;
    unpaged: boolean;
  };
  last: boolean;
  totalPages: number;
  totalElements: number;
  number: number;
  sort: {
    empty: boolean;
    unsorted: boolean;
    sorted: boolean;
  };
}
