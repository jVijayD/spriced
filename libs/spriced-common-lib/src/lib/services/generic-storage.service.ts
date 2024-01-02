import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GenericStorageService {

  constructor() { }
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
