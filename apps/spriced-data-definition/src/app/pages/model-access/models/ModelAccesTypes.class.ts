import { Attribute } from "@angular/core";

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
  id: string | number = 0;
  parentId: string | number | null = 0;
  expandable: boolean = true;
  level!: number;
  expandedOnce: boolean = false;
  initialData?: TreeNode;
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
  }

  public hasModified(): boolean {
    let a = Object.assign({}, this);
    delete a.initialData;
    let b = this.initialData;
    delete b?.initialData;
    return JSON.stringify(a) !== JSON.stringify(b);
  }
}
export class AttributeDTO extends TreeNode {
  name!: string;
}
export class ModelDTO extends TreeNode {
  isDisabled: boolean = false;
  name: string = "";
  constructor(
    id?: string | number,
    parentId?: string | number | null,
    displayName?: string,
    name?: string
  ) {
    super(id, parentId, displayName);
    name ? (this.name = name) : "";
  }
}

export class EntityDTO extends TreeNode {
  isDisabled: boolean = false;
  name!: string;
  private _attributes: AttributeDTO[] = [];

  constructor(
    id?: string | number,
    parentId?: string | number | null,
    displayName?: string
  ) {
    super(id, parentId, displayName);
  }

  public get attributes(): AttributeDTO[] {
    return this._attributes;
  }

  public set attributes(attributes: AttributeDTO[]) {
    this._attributes = attributes.map((d: AttributeDTO) => {
      d.treeStatus = "disabled";
      d.expandable = false;
      d.parentId = this.id;
      d.displayName = d.name;
      d.icon = "view_column";
      return new AttributeDTO().parse(d);
    });
  }
  public override get permission(): PERMISSIONS {
    return super.permission;
  }
  public override set permission(v: PERMISSIONS) {
    super.permission = v;
    if (!this.expandedOnce) {
      this.attributes.forEach((a) => (a.permission = v));
    }
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
