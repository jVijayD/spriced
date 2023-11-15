import { CommonModule } from "@angular/common";
import { ChangeDetectorRef, Component } from "@angular/core";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatSelectChange, MatSelectModule } from "@angular/material/select";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import {
  DialogService,
  DialogueModule,
  HboxComponent,
  SnackBarService,
  Header,
  HeaderActionComponent,
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
  AppDTO,
  AppPermissionsDTO,
  RoleDTO,
} from "./models/AppAccesTypes.class";
import { AppDataService } from "@spriced-frontend/shared/spriced-shared-lib";
import { UserAccessService } from "@spriced-frontend/spriced-common-lib";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { NgxMatSelectSearchModule } from "ngx-mat-select-search";
const POPULATE_ATTRIBUTES = false;
@Component({
    selector: "sp-app-access",
    standalone: true,
    providers: [HttpClient, DialogService, SnackBarService],
    templateUrl: "./app-access.component.html",
    styleUrls: ["./app-access.component.scss"],
    imports: [
        MatButtonModule,
        MatToolbarModule,
        VboxComponent,
        HttpClientModule,
        HboxComponent,
        FormsModule, 
        ReactiveFormsModule,
        HeaderActionComponent,
        NgxDatatableModule,
        NgxMatSelectSearchModule,
        MatIconModule,
        MatFormFieldModule,
        MatSelectModule,
        MatCheckboxModule,
        SnackbarModule,
        CommonModule,
        DialogueModule
    ]
})
export class AppAccessComponent {
  ColumnMode = ColumnMode;
  SelectionType = SelectionType;

  selectedRole!: RoleDTO | null;
  selectedRoleCmp!: RoleDTO | null;
  AppList: AppDTO[] = [];
  AppListBkp: AppDTO[] = [];
  filteredRoleList:any;
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
    this.userAccessService.loadAllRoles().subscribe((roles: string[]) => {
      this.roleList = roles.map((m) => {
        return { name: m } as RoleDTO;
      });
      this.filteredRoleList = this.roleList;
    });
    this.userAccessService.loadAllApps().subscribe((roles: any[]) => {
      this.AppListBkp = roles.map((m) => m as AppDTO);
    });
    this.statusPannelService.init();
  }

  onSaveClick() {
    if (this.selectedRole && this.selectedRole.name) {
      let permissionDto = {
        permissionList: this.AppList.map((a) => {
          return {
            role: this.selectedRole?.name,
            appid: a.id,
            id: a.permissionId,
            permission: a.permission == true ? "ALLOW" : "DENY",
          } as AppPermissionsDTO;
        }),
      } as AppPermissionsDTO;

      this.myService
        .saveAppAccessPermission(permissionDto)
        .subscribe((data: any) => {
          console.log(data);
          this.snackbarService.success("Succesfully Saved");
          if (this.selectedRole) {
            this.populatePermission();
          }
          // this.onClearClick();
        });
    }
  }

  initPermission(set: boolean, val: boolean) {
    this.AppList = [
      ...this.AppList.map((e) => {
        e.originalPermission = set ? val : e.permission;
        return e;
      }),
    ];
  }
  hasModified() {
    return !this.AppList.every((e) => e.permission == e.originalPermission);
  }

  onClearClick() {
    this.statusPannelService.init();
    this.selectedRole = null;
    this.selectedRoleCmp = null;
    this.AppList = [];
  }

  onSelectRole(event: MatSelectChange) {
    if (event.value) {
      if (this.hasModified()) {
        this.showSaveChangesDialogue(event);
      } else {
        this.selectedRole = event.value;
        this.populatePermission();
      }
    } else {
      this.onClearClick();
    }
  }

  filterRolesSelection(text:any){
    this.filteredRoleList = this.roleList.filter((item: any) => {
      return (
        item.name
          .trim()
          .toLowerCase()
          .indexOf(text.trim().toLowerCase()) != -1
      );
    });

  }

  loadAppList(init: boolean) {
    this.AppList = [
      ...this.AppListBkp.map((e) => JSON.parse(JSON.stringify(e))),
    ];
    this.initPermission(init, false);
  }

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
        this.selectedRole = event.value;
      } else if (this.selectedRole) {
        this.selectedRole = event.value;
        this.populatePermission();
      }
    });
  }

  private populatePermission() {
    if (!this.selectedRole) {
      return;
    }
    this.myService
      .getAppPermissions(this.selectedRole.name)
      .subscribe((data: AppPermissionsDTO[]) => {
        this.AppList = this.AppListBkp.map((a) => {
          let dataObj = data.filter((p) => p.appid == a.id)[0];
          a.originalPermission = dataObj?.permission == "ALLOW" ? true : false;
          a.permissionId = dataObj?.id ? dataObj?.id : 0;
          a.permission = a.originalPermission;
          return a;
        });
      });
  }

  checkChange(event: { checked: any }, rowIndex: number, record: any) {
    record["permission"] = event.checked;
  }
}
