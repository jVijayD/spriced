import { CommonModule } from "@angular/common";
import { ChangeDetectorRef, Component } from "@angular/core";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatSelectChange, MatSelectModule } from "@angular/material/select";
import { HboxComponent, VboxComponent } from "@spriced-frontend/spriced-ui-lib";
import { MatToolbarModule } from "@angular/material/toolbar";
import {
  ColumnMode,
  NgxDatatableModule,
  SelectionType,
} from "@swimlane/ngx-datatable";
import { DataDefListService } from "../../services/datadef.service";
import { HttpClient, HttpClientModule } from "@angular/common/http";
import { MatButtonModule } from "@angular/material/button";
import { ModelAccessService } from "./services/model-access.service";
import {
  ModelData,
  PERMISSIONS,
  ModelDTO,
  TreeNode,
  TreeStore,
  RoleDTO,
  EntityDTO,
  AttributeDTO,
} from "./models/ModelAccesTypes.class";
// import { ModelData } from '../model-view/model-view.component';
const POPULATE_ATTRIBUTES = true; 
@Component({
  selector: "sp-model-access",
  standalone: true,
  imports: [
    MatButtonModule,
    MatToolbarModule,
    VboxComponent,
    HttpClientModule,
    HboxComponent,
    NgxDatatableModule,
    MatIconModule,
    MatFormFieldModule,
    MatSelectModule,
    CommonModule,
  ],
  providers: [DataDefListService, HttpClient],
  templateUrl: "./model-access.component.html",
  styleUrls: ["./model-access.component.scss"],
})
export class ModelAccessComponent {

  ColumnMode = ColumnMode;
  SelectionType = SelectionType;

  treeStore: TreeStore = new TreeStore();
  selectedRole!: RoleDTO | null;
  selectedModel!: ModelDTO | null;
  modelList: ModelDTO[] = [];
  modelListBkp: ModelDTO[] = [];
  roleList: RoleDTO[] = [];

  constructor(
    private cd: ChangeDetectorRef,
    private service: DataDefListService,
    private myService: ModelAccessService // private service: DataDefListService
  ) {
    this.onInit();
  }
  onInit() {
    this.roleList = this.myService.getRoles();
    this.service.getModels().subscribe((data: ModelDTO[]) => {
      this.modelList = data.map(m=>new ModelDTO().parse(m));
      this.modelListBkp = data.map(m=>new ModelDTO().parse(m));
    });
  }

  getPermissions() {
    return Object.keys(PERMISSIONS);
  }

  onSaveClick() {}

  onClearClick() {
    this.selectedRole = null;
    this.selectedModel = null;
    this.treeStore = new TreeStore();
    this.modelList = this.modelListBkp;
  }

  onSelectModel(event: MatSelectChange) {
    if (this.hasModified()) {
      this.showSaveChangesDialogue();
    } else {
      let dto = this.getModelById(this.modelList, event.value);
      if (dto) {
        this.treeStore.data = [dto];
      } else {
        this.treeStore.data = [];
      }
    }
  }
  getModelById(modelList: ModelDTO[], value: ModelDTO): ModelDTO | undefined {
    return modelList.find((m: ModelDTO) => m == value);
  }
  showSaveChangesDialogue() {
    throw new Error("Method not implemented.");
  }
  hasModified() {
    return this.treeStore.data.find((node: TreeNode) => node.hasModified);
  }

  private populateEntities(model: ModelDTO) {
    this.service.getEntities(model.id).subscribe((data: EntityDTO[]) => {
      let entitiesList = data.map((d: EntityDTO) => {
        d.parentId = model.id;
        d.id = d.name + d.id;
        return new EntityDTO().parse(d);
      });
      this.treeStore.appendData(entitiesList);
      if(POPULATE_ATTRIBUTES){
        this.treeStore.appendData(entitiesList.flatMap(e=>e.attributes).filter(a=>a));
      }
    });
  }

  onTreeAction(event: any) {
    const row: TreeNode = event.row;
    if (row.expandable == false) return;
    if (row.expandedOnce !== true) {
      if (row.level == 0) {
        const model: ModelDTO = event.row;
        this.populateEntities(model);
      } else {
        const entity: EntityDTO = event.row;
        this.treeStore.appendData(entity.attributes);
      }
      // row.expandedOnce = true;
    }
    row.expanded = !row.expanded;
    // row.treeStatus = row.expanded ? "expanded" : "collapsed";
    this.treeStore.refreshData();
    this.cd.detectChanges();
  }
  updateValue(event: { value: any }, rowIndex: number, record: TreeNode) {
    // const record = this.rows[rowIndex];
    // this.editing[rowIndex] = false;
    record["permission"] = event.value;
    this.treeStore.data = [...this.treeStore.data];
    if (record.level === 0) {
      this.updateChildren(record);
    } else if (record.level === 1) {
      this.updateParent(record);
      this.updateChildren(record);
    } else {
      this.updateParent(record);
    }
  }

  updateParent(record: TreeNode) {
    const parent = this.treeStore.getParent(record);
    if (!parent) return;
    const siblings = this.treeStore.getSiblings(record);
    const siblingPermissionSet = new Set();
    siblings.forEach((element: TreeNode) => {
      if (element.permission) {
        siblingPermissionSet.add(element.permission);
      }
    });
    parent.permission =
      siblingPermissionSet.size > 1 ? PERMISSIONS.PARTIAL : record.permission;
    this.updateParent(parent);
  }

  updateChildren(record: TreeNode) {
    this.treeStore.getChildren(record).forEach((node: TreeNode) => {
      node.permission = record.permission;
      
      this.updateChildren(node);
    });
  }
}
