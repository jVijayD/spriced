import { Attribute, Type } from "@angular/core";

export interface ModelData {
  file: string;
  status: string;
  statusMessage: string;
  entity: string;
}
export interface RoleDTO {
  name: string;
}

export class TreeNode {
  displayName: string = "";
  id: number | string = 0;
  parentId: string | number | null = 0;
  expandable: boolean = true;
  level!: number;
  expandedOnce: boolean = false;
  initialData?: TreeNode;
  initialPermission?: string;
  icon: string = "schema";
  treeStatus: string = "collapsed";
  private _expanded: boolean = false;
  private _permission: PERMISSIONS = PERMISSIONS.DENY;

  public get permission(): PERMISSIONS {
    return this._permission;
  }
  public set permission(value: PERMISSIONS) {
    this._permission = value;
  }
  public parse(ob: Object) {
    let retObj: this = Object.create(this);
    Object.assign(retObj, ob);
    Object.setPrototypeOf(retObj, this);
    return retObj;
  }

  public mapTo(ob: Object) {
    let retObj = Object.create(ob);
    Object.assign(ob, this);
    Object.setPrototypeOf(retObj, ob);
    return retObj;
  }

  public get expanded() {
    return this._expanded;
  }

  public set expanded(v: boolean) {
    this._expanded = v;
    if (v) {
      this.expandedOnce = true;
    }
    this.treeStatus = this._expanded ? "expanded" : "collapsed";
  }

  constructor(
    id?: string | number,
    parentId?: string | number | null,
    displayName?: string
  ) {
    this.id = id ? id : this.id;
    this.displayName = displayName ? displayName : this.displayName;
    this.parentId = parentId ? parentId : this.parentId;
    this.initialData = Object.assign({}, this);
    this.initialPermission =  this.permission;
  }

  public hasModified(): boolean {
    let a = Object.assign({}, this);
    delete a.initialData;
    let b = this.initialData;
    delete b?.initialData;
    // return JSON.stringify(a) !== JSON.stringify(b);
    return this.initialPermission !== this.permission;
  }
}
export class AttributeDTO extends TreeNode {
  attribute_id?: string;
  name!: string;
}
export class ModelDTO extends TreeNode {
  isDisabled: boolean = false;
  model_id: number;
  name: string = "";
  constructor(
    model_id: number,
    id?: string | number,
    parentId?: string | number | null,
    displayName?: string,
    name?: string
  ) {
    super(id, parentId, displayName);
    this.model_id = model_id;
    name ? (this.name = name) : "";
  }
}

export class EntityDTO extends TreeNode {
  isDisabled: boolean = false;
  name!: string;
  entityId: number;
  model_id: number;
  private _attributes: AttributeDTO[] = [];

  constructor(
    id?: string | number,
    parentId?: string | number | null,
    entityId?: number,
    displayName?: string,
    model_id?: number
  ) {
    super(id, parentId, displayName);
    this.entityId = entityId ? entityId : 0;
    this.model_id = model_id ? model_id : 0;
  }

  public get attributes(): AttributeDTO[] {
    return this._attributes;
  }

  public set attributes(attributes: AttributeDTO[]) {
    let attribPermissions = new Set<PERMISSIONS>();
    this._attributes = attributes.map((d: AttributeDTO) => {
      d.attribute_id = d.id.toString();
      d.treeStatus = "disabled";
      d.expandable = false;
      d.parentId = this.id;
      d.displayName = d.name;
      d.icon = "view_column";
      attribPermissions.add(d.permission);
      return new AttributeDTO().parse(d);
    });
    this.permission =
      attribPermissions.size > 1
        ? PERMISSIONS.PARTIAL
        : attribPermissions.size == 1
        ? [...attribPermissions][0]
        : PERMISSIONS.DENY;
  }
}

export class TreeStore {
  data: TreeNode[] = [];

  getChildren(record: TreeNode | undefined): TreeNode[] {
    if (!record) return [];
    return this.data.filter((c: TreeNode) => c.parentId === record.id);
  }

  getSiblings(record: TreeNode): TreeNode[] {
    return this.getChildren(this.getParent(record));
  }

  getParent(record: TreeNode): TreeNode | undefined {
    return this.data.find((c: TreeNode) => record.parentId === c.id);
  }

  appendData(newData: TreeNode[]) {
    this.data = [...this.data, ...newData];
  }

  refreshData() {
    this.data = [...this.data];
  }

  setInitialData() {
    this.data.forEach((n) => {
      n.initialData = Object.assign({}, n);
    });
  }

  getModified() {
    return this.data.filter((n) => n.hasModified());
  }
}

export enum PERMISSIONS {
  READ = "READ",
  UPDATE = "UPDATE",
  DENY = "DENY",
  PARTIAL = "PARTIAL",
}

export class RoleEntityPermissionMapping {
  id?: number;
  groupId?: number | string;
  role?: String;
  entityId: number | string;
  permission: PERMISSIONS;
  attributedetails?: string;
  constructor(
    entityId: number,
    permission: PERMISSIONS,
    groupId?: number,
    role?: string,
    attributedetails?: string
  ) {
    this.entityId = entityId;
    this.groupId = groupId ? groupId : 0;
    this.permission = permission;
    this.role = role ? role : "";
    this.attributedetails = attributedetails ? attributedetails : "";
  }
}
export class RoleGroupPermissionMapping {
  id?: number;
  groupId: number | string;
  role: string;
  permission: PERMISSIONS;
  updatedDate?: string;
  updatedBy?: string;
  entityPermissions?: RoleEntityPermissionMapping[];
  constructor(groupId: number, role: string, permission?: PERMISSIONS) {
    this.groupId = groupId;
    this.role = role;
    this.permission = permission ? permission : PERMISSIONS.DENY;
  }
}
