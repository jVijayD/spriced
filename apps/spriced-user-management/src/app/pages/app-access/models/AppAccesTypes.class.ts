import { Attribute, Type } from "@angular/core";

export interface AppDTO {
  code: string;
  description: string;
  displayName: string;
  icon: string;
  id: number;
  name: string;
  path: string;
  status: boolean;
}
export interface AppPermissionsDTO {
  id: number;
  role: string;
  appid: number;
  permission: string;
  permissionList: AppPermissionsDTO[];
}
export interface RoleDTO {
  name: string;
}

export enum PERMISSIONS {
  READ = "READ",
  UPDATE = "UPDATE",
  DENY = "DENY",
  PARTIAL = "PARTIAL",
}

