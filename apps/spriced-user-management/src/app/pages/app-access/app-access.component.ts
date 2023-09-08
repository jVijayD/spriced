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
import { AppAccessService } from "./services/app-access.service";
import {
  PERMISSIONS,
  AppDTO,
  RoleDTO,
} from "./models/AppAccesTypes.class";
import {
  AppDataService,
} from "@spriced-frontend/shared/spriced-shared-lib";
import { MatSnackBar } from "@angular/material/snack-bar";
import { UserAccessService } from "@spriced-frontend/spriced-common-lib";

const POPULATE_ATTRIBUTES = false;
@Component({
  selector: "sp-app-access",
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
  ],
  providers: [HttpClient, DialogService, SnackBarService],
  templateUrl: "./app-access.component.html",
  styleUrls: ["./app-access.component.scss"],
})
export class AppAccessComponent {
  ColumnMode = ColumnMode;
  SelectionType = SelectionType;

  // treeStore: TreeStore = new TreeStore();
  selectedRole!: RoleDTO | null;
  selectedApp!: AppDTO | null;
  AppList: AppDTO[] = [];
  AppListBkp: AppDTO[] = [];
  roleList: RoleDTO[] = [];

  constructor(
    private cd: ChangeDetectorRef,
    private dialogService: DialogService,
    private snackbarService: SnackBarService,
    private userAccessService: UserAccessService,
    private statusPannelService: AppDataService,
    private myService: AppAccessService // private service: DataDefListService
  ) {
    this.onInit();
  }
  onInit() {
    // this.roleList = this.myService.getRoles();
    // this.myService.getApps().subscribe((data: AppDTO[]) => {
    //   this.AppList = data.map((m) => {
    //     let mdl = new AppDTO(Number.parseInt(m.id.toString())).parse(m);
    //     // this.AppListBkp.push(mdl.parse(m));
    //     return mdl;
    //   });
    // });
    this.userAccessService.loadAllRoles().subscribe((roles: string[]) => {
      this.roleList = roles.map((m) => {
        return { name: m } as RoleDTO;
      });
    });
    this.userAccessService.loadAllApps().subscribe((roles: any[]) => {
      this.AppList = roles.map((m) => m as AppDTO);
    });
    this.statusPannelService.init();
  }

  getPermissions() {
    return Object.keys(PERMISSIONS);
  }

  onSaveClick() {
    // if (
    //   this.selectedApp &&
    //   this.selectedRole &&
    //   this.selectedApp.id &&
    //   this.selectedRole.name
    // ) {
    //   let AppRecord = this.treeStore.data.find(
    //     (m) => m.id == this.selectedApp?.id
    //   );
    //   let groupPermission: RoleGroupPermissionMapping =
    //     new RoleGroupPermissionMapping(
    //       this.selectedApp.App_id,
    //       this.selectedRole.name,
    //       AppRecord?.permission
    //     );
    //   groupPermission.entityPermissions = this.treeStore
    //     .getChildren(AppRecord)
    //     .filter((n) => n.permission != PERMISSIONS.DENY)
    //     .map(
    //       (en: any) =>
    //         new RoleEntityPermissionMapping(
    //           en.entityId,
    //           en.permission,
    //           this.selectedApp?.App_id,
    //           groupPermission.role,
    //           en?.attributes
    //             .filter((e: AttributeDTO) => e.permission != PERMISSIONS.DENY)
    //             .map((e: AttributeDTO) => {
    //               return { id: e.id, permission: e.permission };
    //             })
    //         )
    //     );
    //   this.myService
    //     .saveAppAccessPermission(groupPermission)
    //     .subscribe((data: any) => {
    //       console.log(data);
    //       this.snackbarService.success("Succesfully Saved");
    //       if (this.selectedApp) {
    //         // this.loadTree(this.selectedApp);
    //       }
    //       // this.onClearClick();
    //     });
    // }
  }

  onClearClick() {
    this.statusPannelService.init();
    this.selectedRole = null;
    this.selectedApp = null;
    // this.treeStore.data = [];
    // this.AppList.forEach((m) => (m.expandedOnce = false));
  }

  onSelectRole(event: MatSelectChange) {
    if (!this.selectedApp) return;
    // if (this.hasModified()) {
    //   this.showSaveChangesDialogue(event);
    // } else {
    //   this.loadTree(this.selectedApp);
    // }
  }

  // loadTree(mdl: AppDTO) {
  //   this.treeStore.data = [mdl];
  //   this.populateEntities(mdl);
  // }

  onSelectApp(event: MatSelectChange) {
    // if (this.hasModified()) {
    //   this.showSaveChangesDialogue(event);
    // } else {
    //   this.loadTree(event.value);
    // }
  }

  // getAppById(AppList: AppDTO[], value: AppDTO): AppDTO | undefined {
  //   return AppList.find((m: AppDTO) => m == value);
  // }

  // showSaveChangesDialogue(event: MatSelectChange) {
  //   const dialogResult = this.dialogService.openConfirmDialoge({
  //     title: "Confirm",
  //     icon: "public",
  //     message:
  //       "All the unsaved changes will be lost. Do you want to save the changes ?",
  //     maxWidth: 400,
  //   });

  //   dialogResult.afterClosed().subscribe((val) => {
  //     if (val) {
  //       this.onSaveClick();
  //     } else if (this.selectedApp) {
  //       this.loadTree(this.selectedApp);
  //     }
  //   });
  // }

  // hasModified() {
  //   return this.treeStore.data.find((node: TreeNode) => node.hasModified());
  // }

  // private populateEntities(App: AppDTO) {
  //   if (!this.selectedRole || !this.selectedApp) {
  //     return;
  //   }
  //   this.myService
  //     .getEntities(App.id, this.selectedRole.name)
  //     .subscribe((data: EntityDTO[]) => {
  //       let entitiesList = data.map((d: EntityDTO) => {
  //         d.entityId = Number.parseInt(d.id.toString());
  //         d.parentId = App.id;
  //         d.id = d.name + d.id;
  //         return new EntityDTO().parse(d);
  //       });
  //       this.treeStore.appendData(entitiesList);
  //       if (POPULATE_ATTRIBUTES) {
  //         this.treeStore.appendData(entitiesList.flatMap((e) => e.attributes));
  //       }
  //       if (entitiesList[0]) {
  //         this.updateParent(entitiesList[0]);
  //       }
  //       App.initialPermission = App.permission;
  //     });
  // }

  onTreeAction(event: any) {
    //   const row: TreeNode = event.row;
    //   if (row.expandable == false) return;
    //   if (row.expandedOnce !== true) {
    //     if (row.level == 0) {
    //       // const App: AppDTO = event.row;
    //       // this.populateEntities(App);
    //     } else {
    //       const entity: EntityDTO = event.row;
    //       this.treeStore.appendData(entity.attributes);
    //     }
    //     // row.expandedOnce = true;
    //   }
    //   row.expanded = !row.expanded;
    //   // row.treeStatus = row.expanded ? "expanded" : "collapsed";
    //   this.treeStore.refreshData();
    //   this.cd.detectChanges();
  }

  // updateValue(event: { value: any }, rowIndex: number, record: TreeNode) {
  //   // const record = this.rows[rowIndex];
  //   // this.editing[rowIndex] = false;
  //   record["permission"] = event.value;
  //   this.treeStore.data = [...this.treeStore.data];
  //   if (record.level === 0) {
  //     this.updateChildren(record);
  //   } else if (record.level === 1) {
  //     this.updateParent(record);
  //     this.updateChildren(record);
  //   } else {
  //     this.updateParent(record);
  //   }
  // }

  // updateParent(record: TreeNode) {
  //   const parent = this.treeStore.getParent(record);
  //   if (!parent) return;
  //   const siblings = this.treeStore.getSiblings(record);
  //   const siblingPermissionSet = new Set();
  //   siblings.forEach((element: TreeNode) => {
  //     if (element.permission) {
  //       siblingPermissionSet.add(element.permission);
  //     }
  //   });
  //   parent.permission =
  //     siblingPermissionSet.size > 1 ? PERMISSIONS.PARTIAL : record.permission;
  //   this.updateParent(parent);
  // }

  // updateChildren(record: TreeNode) {
  //   this.treeStore.getChildren(record).forEach((node: TreeNode) => {
  //     node.permission = record.permission;

  //     this.updateChildren(node);
  //   });
  // }
}
