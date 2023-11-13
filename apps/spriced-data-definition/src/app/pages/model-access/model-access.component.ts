import { CommonModule } from "@angular/common";
import { ChangeDetectorRef, Component } from "@angular/core";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatSelectChange, MatSelectModule } from "@angular/material/select";
import {
  DialogService,
  DialogueModule,
  HboxComponent,
  SnackBarService,
  SnackbarModule,
  VboxComponent,
} from "@spriced-frontend/spriced-ui-lib";
import { MatToolbarModule } from "@angular/material/toolbar";
import {
  ColumnMode,
  NgxDatatableModule,
  SelectionType,
} from "@swimlane/ngx-datatable";
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
  RoleGroupPermissionMapping,
  RoleEntityPermissionMapping,
} from "./models/ModelAccesTypes.class";
import {
  ErrorTypes,
  AppDataService,
} from "@spriced-frontend/shared/spriced-shared-lib";
import { MatSnackBar } from "@angular/material/snack-bar";
import { UserAccessService } from "@spriced-frontend/spriced-common-lib";
import { NgxMatSelectSearchModule } from "ngx-mat-select-search";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
const POPULATE_ATTRIBUTES = false;
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
    SnackbarModule,
    CommonModule,
    DialogueModule,
    NgxMatSelectSearchModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [HttpClient, UserAccessService, DialogService, SnackBarService],
  templateUrl: "./model-access.component.html",
  styleUrls: ["./model-access.component.scss"],
})
export class ModelAccessComponent {
  ColumnMode = ColumnMode;
  SelectionType = SelectionType;
  filteredModelList: any;
  filteredRoleList: any;

  treeStore: TreeStore = new TreeStore();
  selectedRole!: RoleDTO | null;
  selectedModel!: ModelDTO | null;
  modelList: ModelDTO[] = [];
  modelListBkp: ModelDTO[] = [];
  roleList: RoleDTO[] = [];

  constructor(
    private cd: ChangeDetectorRef,
    private dialogService: DialogService,
    private userAccessService: UserAccessService,
    private snackbarService: SnackBarService,
    private statusPannelService: AppDataService,
    private myService: ModelAccessService // private service: DataDefListService
  ) {
    this.onInit();
  }
  onInit() {
    
    this.myService.getModels().subscribe((data: ModelDTO[]) => {
      this.modelList = data.map((m) => {
        let mdl = new ModelDTO(Number.parseInt(m.id.toString())).parse(m);
        // this.modelListBkp.push(mdl.parse(m));
        return mdl;
      });
      this.filteredModelList = this.modelList;
    });
    this.userAccessService
    .loadAllRoles()
    .subscribe((roles: string[]) => {
      this.roleList = roles.map((m) => {
        return { name: m } as RoleDTO;
      });
      this.filteredRoleList = this.roleList;
    });
    this.statusPannelService.init();
  }

  getPermissions() {
    return Object.keys(PERMISSIONS);
  }

  filterModelsSelection(text: any) {
    this.filteredModelList = this.modelList.filter((item: any) => {
      return (
        item.displayName
          .trim()
          .toLowerCase()
          .indexOf(text.trim().toLowerCase()) != -1
      );
    });
  }

  filterRolesSelection(text: any) {
    this.filteredRoleList = this.roleList.filter((item: any) => {
      return (
        item.name
          .trim()
          .toLowerCase()
          .indexOf(text.trim().toLowerCase()) != -1
      );
    });
  }

  onSaveClick() {
    if (
      this.selectedModel &&
      this.selectedRole &&
      this.selectedModel.id &&
      this.selectedRole.name
    ) {
      let modelRecord = this.treeStore.data.find(
        (m) => m.id == this.selectedModel?.id
      );
      let groupPermission: RoleGroupPermissionMapping =
        new RoleGroupPermissionMapping(
          this.selectedModel.model_id,
          this.selectedRole.name,
          modelRecord?.permission
        );
      groupPermission.entityPermissions = this.treeStore
        .getChildren(modelRecord)
        .filter((n) => n.permission != PERMISSIONS.DENY)
        .map(
          (en: any) =>
            new RoleEntityPermissionMapping(
              en.entityId,
              en.permission,
              this.selectedModel?.model_id,
              groupPermission.role,
              en?.attributes
                .filter((e: AttributeDTO) => e.permission != PERMISSIONS.DENY)
                .map((e: AttributeDTO) => {
                  return { id: e.id, permission: e.permission };
                })
            )
        );
      this.myService
        .saveModelAccessPermission(groupPermission)
        .subscribe((data: any) => {
          console.log(data);
          this.snackbarService.success("Succesfully Saved");
          if (this.selectedModel) {
            this.loadTree(this.selectedModel);
          }
          // this.onClearClick();
        });
    }
  }

  onClearClick() {
    this.statusPannelService.init();
    this.selectedRole = null;
    this.selectedModel = null;
    this.treeStore.data = [];
    this.modelList.forEach((m) => (m.expandedOnce = false));
    this.filteredModelList = this.modelList;
  }

  onSelectRole(event: MatSelectChange) {
    if (!this.selectedModel) return;
    if (this.hasModified()) {
      this.showSaveChangesDialogue(event);
    } else {
      this.loadTree(this.selectedModel);
    }
  }

  loadTree(mdl: ModelDTO) {
    this.treeStore.data = [mdl];
    this.populateEntities(mdl);
  }

  onSelectModel(event: MatSelectChange) {
    if (this.hasModified()) {
      this.showSaveChangesDialogue(event);
    } else {
      this.loadTree(event.value);
    }
  }

  // getModelById(modelList: ModelDTO[], value: ModelDTO): ModelDTO | undefined {
  //   return modelList.find((m: ModelDTO) => m == value);
  // }

  showSaveChangesDialogue(event: MatSelectChange) {
    const dialogResult = this.dialogService.openConfirmDialoge({
      title: "Confirm",
      icon: "public",
      message:
        "All the unsaved changes will be lost. Do you want to save the changes ?",
      maxWidth: 400,
    });

    dialogResult.afterClosed().subscribe((val) => {
      if (val) {
        this.onSaveClick();
      } else if (this.selectedModel) {
        this.loadTree(this.selectedModel);
      }
    });
  }

  hasModified() {
    return this.treeStore.data.find((node: TreeNode) => node.hasModified());
  }

  private populateEntities(model: ModelDTO) {
    if (!this.selectedRole || !this.selectedModel) {
      return;
    }
    this.myService
      .getEntities(model.id, this.selectedRole.name)
      .subscribe((data: EntityDTO[]) => {
        let entitiesList = data.map((d: EntityDTO) => {
          d.entityId = Number.parseInt(d.id.toString());
          d.parentId = model.id;
          d.id = d.name + d.id;
          return new EntityDTO().parse(d);
        });
        this.treeStore.appendData(entitiesList);
        if (POPULATE_ATTRIBUTES) {
          this.treeStore.appendData(entitiesList.flatMap((e) => e.attributes));
        }
        if (entitiesList[0]) {
          this.updateParent(entitiesList[0]);
        }
        model.initialPermission = model.permission;
      });
  }

  onTreeAction(event: any) {
    const row: TreeNode = event.row;
    if (row.expandable == false) return;
    if (row.expandedOnce !== true) {
      if (row.level == 0) {
        // const model: ModelDTO = event.row;
        // this.populateEntities(model);
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
