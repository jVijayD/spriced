export interface HierarchyDetails {
  id: number;
  hierarchyId: number;
  level: number;
  tablename: string;
  tabledisplayname: string;
  localColumn: string;
  refColumn: string;
  entity: any;
}
export interface Hierarchy {
  id: number;
  entityId: number;
  modelId: number;
  name: string;
  description: string;
  updatedBy: string;
  updatedDate: Date;
  details: HierarchyDetails[]|null;
}
