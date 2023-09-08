import { Attribute, Type } from "@angular/core";

export interface AppDTO {
  code: string;
  description: string;
  displayName: string;
  icon: string;
  id: number;
  permissionId: number;
  name: string;
  path: string;
  status: boolean;
  permission: boolean;
  originalPermission: boolean;
}
export interface AppPermissionsDTO {
  id: number;
  role: string;
  appid: number;
  permission: string;
  permissionList:AppPermissionsDTO[]
}
export interface RoleDTO {
  name: string;
}