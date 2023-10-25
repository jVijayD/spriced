import { Entity, Model } from "@spriced-frontend/spriced-common-lib";

export interface HierarchyDetails {
  id: number;
  hierarchyId: number;
  // parentRefId: number | null;
  // refId: number;
  groupLevel: number;
  entityName: string;
  entityId: number;
  tabledisplayname: string;
  localColumn: string;
  refColumn: string;
  entity: any;
}

export interface HierarchyTreeNode {
  id: number;
  parentId?: number | null;
  treeStatus: string;
  tablename: string;
  tableId: number;
  name: string;
}
export interface PreviewTreeNode {
  id: number;
  level: number;
  grpId: string;
  parentId?: number | null;
  parentGrpId?: string | null;
  treeStatus: string;
  column: string;
  tableId: number;
  name: string;
  code: string;
  loaded: boolean;
}

export interface Hierarchy {
  id: number;
  entityId: number;
  modelId: number;
  name: string;
  description: string;
  updatedBy?: string;
  updatedDate?: Date;
  details: HierarchyDetails[] | null;
  model?: Model | null;
  entity?: Entity | null;
}
