export interface ModelData {
  file: string;
  status: string;
  statusMessage: string;
  entity: string;
}
export interface RoleDTO {
  name: string;
}

export interface AttributeDTO extends TreeNode {
  displayName: string;
  id: number;
  isDisabled: boolean;
  name: string;
  updatedBy: string;
  updatedDate: Date;

}

export class TreeNode {
  displayName: string = "";
  id: string | number = 0;
  parentId: string | number | null = 0;
  expandable: boolean = true;
  level!: number;
  expandedOnce: boolean = false;
  rawTreeNode: TreeNode;
  icon: string = "schema";
  treeStatus: string = "collapsed";

  public static parse(ob: Object): TreeNode {
    let dto: TreeNode = new TreeNode();
    Object.assign(dto, ob);
    return dto;
  }

  public set expanded(v: boolean) {
    this.expanded = v;
    this.treeStatus = this.expanded ? "expanded" : "collapsed";
  }
  constructor(
    id?: string | number,
    parentId?: string | number | null,
    displayName?: string
  ) {
    this.id = id ? id : this.id;
    this.displayName = displayName ? displayName : this.displayName;
    this.parentId = parentId ? parentId : this.parentId;
    this.rawTreeNode = this;
  }

  public hasModified(): boolean {
    return this !== this.rawTreeNode;
  }

  public set permission(v: PERMISSIONS) {
    this.permission = v;
  }
}
export class ModelTreeNode extends TreeNode {}

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
  constructor(
    id?: string | number,
    parentId?: string | number | null,
    displayName?: string,
    attributes: AttributeDTO[] = []
  ) {
    super(id, parentId, displayName);
    this.attributes = attributes;
  }

  public override set permission(v: PERMISSIONS) {
    super.permission = v;
    this.attributes.forEach((a) => (a.permission = v));
  }

  public set attributes(attributes: AttributeDTO[]) {
    this.attributes = attributes.map((d: AttributeDTO) => {
        d.expanded = false;
        d.expandable = false;
        d.parentId = this.id;
        d.displayName=d.name;
        d.icon = "view_column";
        return d;
      });;
  }

  public get attributes(): AttributeDTO[] {
    return this.attributes.map((d: AttributeDTO) => {
      d.expanded = false;
      d.expandable = false;
      d.parentId = this.id;
      d.displayName=d.name;
      d.icon = "view_column";
      return d;
    });
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
}

export enum PERMISSIONS {
  READ = "READ",
  UPDATE = "UPDATE",
  DENY = "DENY",
  PARTIAL = "PARTIAL",
}
