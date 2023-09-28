import { Entity, Model } from "@spriced-frontend/spriced-common-lib";

export interface HierarchyDetails {
  id: number;
  hierarchyId: number;
  // parentRefId: number | null;
  // refId: number;
  groupLevel: number;
  tablename: string;
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
  name: string;
  expanded: boolean;
}

export interface Hierarchy {
  id: number;
  entityId: number;
  modelId: number;
  name: string;
  description: string;
  updatedBy: string;
  updatedDate: Date;
  details: HierarchyDetails[] | null;
  model: Model | null;
  entity: Entity | null;
}
