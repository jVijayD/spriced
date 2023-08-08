import { Injectable } from "@angular/core";

@Injectable({ providedIn: "root" })
export class RequestUtilityService {
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
