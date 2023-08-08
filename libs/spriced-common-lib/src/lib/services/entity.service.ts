import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

@Injectable({ providedIn: "root" })
export class EntityService {
  api_url: string;
  constructor(private http: HttpClient) {
    this.api_url = process.env["NX_API_DEFINITION_URL"] as string;
  }

  add(body: any) {
    return this.http.post(`${this.api_url}/entities`, body);
  }
  delete(id: number) {
    return this.http.delete(`${this.api_url}/entities/${id}`);
  }
  edit(entity: any) {
    return this.http.patch(`${this.api_url}/entities/${entity.id}`, entity);
  }
  load(id: number) {
    return this.http.delete(`${this.api_url}/entities/${id}`);
  }
  loadEntityByModel(id: number) {
    return this.http.get<Entity[]>(`${this.api_url}/models/${id}/entities`);
  }
}

export interface Entity {
  attributes: Attribute[];
  autoNumberCode: boolean;
  comment: null | string;
  displayName: string;
  enableAuditTrial: boolean;
  groupId: number;
  id: number;
  isDisabled: boolean;
  name: string;
  updatedBy: string;
  updatedDate: string;
}

export interface Attribute {
  id: string;
  name: string;
  displayName: string;
  dataType:
    | "STRING_VAR"
    | "TEXT"
    | "INTEGER"
    | "DECIMAL"
    | "LINK"
    | "TIME_STAMP"
    | "BOOLEAN"
    | "AUTO"
    | "SERIAL";
  type: "FREE_FORM" | "LOOKUP";
  size: number;
  nullable: boolean;
  defaultValue?: any;
  referencedTable?: string;
  referencedTableName?: string;
  referencedTableId?: string | number;
  businessIdAppender?: string;
  formatter?: string;
  numberOfDecimalValues: number;
  permission: "UPDATE" | "DENY" | "VIEW";
  constraintType:
    | "NONE"
    | "PRIMARY_KEY"
    | "UNIQUE_KEY"
    | "COMPOSITE_UNIQUE_KEY"
    | "FOREIGN_KEY";
  autoGenerated: boolean;
  editable: boolean;
  showInForm: boolean;
  systemAttribute: boolean;
}
