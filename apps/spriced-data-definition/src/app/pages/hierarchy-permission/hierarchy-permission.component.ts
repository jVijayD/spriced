import { ChangeDetectorRef, Component, HostListener, OnInit, ViewChild } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatSelectModule } from "@angular/material/select";
import { MatOptionModule } from "@angular/material/core";
import { MatSelectSearchComponent, NgxMatSelectSearchModule } from "ngx-mat-select-search";
import { ColumnMode, DatatableComponent, NgxDatatableModule, SelectionType, SortType } from "@swimlane/ngx-datatable";
import { DataGridComponent } from "@spriced-frontend/spriced-ui-lib";
import { Criteria, Entity, EntityService, ModelService, Model, UserAccessService, sortService } from "@spriced-frontend/spriced-common-lib";
import { HierarchyServiceService } from "../hierarchy-definition/service/hierarchy-service.service";
import { Subject, debounceTime } from "rxjs";
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";
import { Hierarchy, HierarchyDetails, HierarchyTreeNode, PreviewTreeNode, permissions } from "../hierarchy-definition/models/HierarchyTypes.class";
import { MatIconModule } from "@angular/material/icon";
import { KeycloakService } from "keycloak-angular";
import { MatMenuModule } from "@angular/material/menu";
import { RoleDTO } from "../model-access/models/ModelAccesTypes.class";
import { MatTooltipModule } from "@angular/material/tooltip";

@Component({
  selector: "sp-hierarchy-permission",
  standalone: true,
  imports: [CommonModule, MatFormFieldModule, MatSelectModule, MatOptionModule, NgxMatSelectSearchModule, DataGridComponent, FormsModule, ReactiveFormsModule, NgxDatatableModule, MatIconModule, MatMenuModule,MatTooltipModule],
  templateUrl: "./hierarchy-permission.component.html",
  styleUrls: ["./hierarchy-permission.component.scss"],
})
export class HierarchyPermissionComponent implements OnInit {
  public listForm!: FormGroup;
  public filteredModels: any;
  public modelList: any;
  public hierarchyList: any;
  public entityList: any;
  pageSize: number = 500;
  currentCriteria: Criteria = {
    filters: [],
    pager: {
      pageNumber: 0,
      pageSize: this.pageSize,
    },
  };
  public filteredEntities: any = [
    {
      displayName: 'All',
      id: 'ALL'
    }
  ];
  public filteredHierarchy: any = [
    {
      name: 'All',
      id: 'ALL'
    }
  ];
  id: number = 0;
  name: string = "";
  description: string = "";
  @ViewChild(DatatableComponent)
  table!: DatatableComponent;
  public model!: Model;
  public defaultModelId: any;
  public defaultEntity: any = 'ALL';
  public defaultHierarchy: any = 'ALL';
  public rows: any = [];
  public totalElement!: number;
  selectionType: SelectionType = SelectionType.single;
  sortType = SortType.single;
  columnMode: ColumnMode = ColumnMode.force;
  ColumnMode = ColumnMode;
  resizeTable = new Subject<any>();
  hierarchyDetails: HierarchyDetails[] = [];
  hierarchyLevelNodes: HierarchyTreeNode[] = [];
  hierarchyPreviewNodes: PreviewTreeNode[] = [];
  availableEntities: Entity[] = [];
  hierarchyForm!: FormGroup;
  selectedModel!: Model | null;
  selectedEntity!: Entity | null;
  dropDownItems: any[] = [{ name: 'Read-only', value: 'READ' }, { name: 'Update', value: 'UPDATE' }, { name: 'Deny', value: 'DENY' }]
  roleList: any;
  selectedRole: any;
  allHierarchyList: any;
  hierarchyLevels: any = [];

  permissionHeaders: any[] = [
    {
      column: "tablename",
      name: "Name",
      canAutoResize: true,
      isSortable: false,
    }
  ]
  headers: any[] = [
    {
      column: "hierarchy",
      name: "Hierarchy",
      canAutoResize: true,
      isSortable: false,
    },
    {
      column: "coalesce",
      name: "Member",
      canAutoResize: true,
      isSortable: false,
    },
    {
      column: "permission",
      name: "Permission",
      canAutoResize: true,
      isSortable: false,
    },
  ];
  filteredRoleList: any;
  allRoleList: any;

  constructor(
    private cd: ChangeDetectorRef,
    private modelService: ModelService,
    private entityService: EntityService,
    private HierarchyService: HierarchyServiceService,
    private fb: FormBuilder,
    private hierarchyService: HierarchyServiceService,
    protected readonly keycloak: KeycloakService,
    private userAccessService: UserAccessService,

  ) {
    this.resizeTable.pipe(debounceTime(400)).subscribe(() => {
      this.table.recalculate();
    });
    this.listForm = this.fb.group({
      modelFilter: new FormControl(''),
      entityFilter: new FormControl(''),
      hierarchyFilter: new FormControl(''),
      roleFilter:new FormControl('')
    });
  }

  async ngOnInit() {
    // this.role =
    //   this.keycloak.getKeycloakInstance().tokenParsed?.realm_access?.roles;
    const { roles } = await this.getAllRoles();
    if (roles) {
      this.roleList = roles.map((m: any) => {
        return { name: m } as RoleDTO;
      });
      this.roleList
      this.selectedRole = this.roleList[0].name;
    }
    this.getAllModels();

    this.listForm.valueChanges.pipe(
      debounceTime(500)
    ).subscribe((item: any) => {
      this.filteredModels = this.filterItems(this.modelList, item.modelFilter);
      this.filteredEntities = this.filterItems(this.entityList, item.entityFilter);
      this.filteredHierarchy = this.filterItems(this.hierarchyList, item.hierarchyFilter);
    })
    this.allRoleList=this.roleList
    this.listForm.controls['roleFilter'].valueChanges.subscribe((item: any) => {
      this.roleList = this.filterItems(this.allRoleList, item);
    })
  }

  public getAllRoles(): Promise<any> {
    return new Promise((resolve, rejects) => {
      this.userAccessService
        .loadAllRoles().subscribe((res: any) => {
          resolve({
            roles: res
          });
        },
          (err) => {
            rejects({
              roles: []
            })
          }
        )
    });
  }

  // Generic filtering function
  filterItems(items: any[], searchText: string): any[] {
    if (searchText === '') {
      return items;
    }
    return items.filter((item: any) => {
      return (item.displayName || item.name)
        .trim()
        .toLowerCase()
        .includes(searchText.trim().toLowerCase());
    });
  }

  public getAllModels() {
    this.modelService.loadAllModels().subscribe((res: any) => {
      this.filteredModels = res;
      this.modelList = res;
      this.defaultModelId = res ? res[0].id : '';
      this.model = res ? res[0] : '';
      this.getEntityByGroupId(this.defaultModelId);
      this.getAllHierarchyByModelId(res[0]);
      this.loadHeirarchysummaryByModelId(res[0], this.selectedRole, this.currentCriteria)
    })
  }

  public getEntityByGroupId(id: any) {
    this.entityService.loadEntityByModel(id).subscribe((el: any) => {
      el=sortService(this.modelList,id,el);
      this.filteredEntities = [{
        displayName: 'All',
        id: 'ALL'
      }, ...el];
      this.entityList = this.filteredEntities;
    })
  }

  public getAllHierarchyByModelId(model: any) {
    this.HierarchyService.loadAllHierarchies(model).subscribe((el: any) => {
      this.filteredHierarchy = [{
        name: 'All',
        id: 'ALL'
      }, ...el];
      this.hierarchyList = this.filteredHierarchy;
      this.allHierarchyList = this.hierarchyList;
    })
  }

  public handleEntityByModels(id: any) {
    this.defaultEntity = 'ALL';
    this.defaultHierarchy = 'ALL';
    this.model = this.modelList.find((res: any) => res.id === id)
    this.resetDatatable()
    this.getEntityByGroupId(id);
    this.loadHeirarchysummaryByModelId(this.model, this.selectedRole, this.currentCriteria);
    this.getAllHierarchyByModelId(this.model);
  }

  public loadHeirarchysummaryByModelId(model: Model, role: any, criteria: Criteria) {
    this.HierarchyService.loadHeirarchysummaryByModelId(model, role, criteria).subscribe({
      next: ((res) => {
        this.rows = res.content;
        this.totalElement = res.totalElements;
      }),
      error: ((error) => {
        console.log(error)
      })
    })
  }

  public handleHierarchyByEntityId(item: any) {
    this.defaultHierarchy = 'ALL';
    this.hierarchyList = this.allHierarchyList;
    this.hierarchyPreviewNodes = [];
    if (item.value !== 'ALL') {
      this.currentCriteria = {
        ...this.currentCriteria,
        filters: [{ "filterType": "CONDITION", "joinType": "NONE", "operatorType": "EQUALS", "key": "entity_id", "value": item.value, "dataType": "number" }]
      }
      this.hierarchyService.loadHierarchiesByEntityId(this.model.id, this.currentCriteria).subscribe((res: any) => {
        this.loadHeirarchysummaryByModelId(this.model, this.selectedRole, this.currentCriteria);
        this.filteredHierarchy = [{
          name: 'All',
          id: 'ALL'
        }, ...res];
        this.hierarchyList = this.filteredHierarchy;
      })
    }
  }

  public onSelectRole(role: any) {
    this.selectedRole = role.value;
    this.loadHeirarchysummaryByModelId(this.model, this.selectedRole, this.currentCriteria);
  }

  public handleHierarchy(id: any) {
    this.hierarchyPreviewNodes = [];
    if (id !== 'ALL') {
      const hierarchy = this.hierarchyList.find((el: any) => el.id === id);
      this.HierarchyService.loadHierarchy(hierarchy).subscribe((res: any) => {
        console.log(res, '>????');
        this.onBind(res);
      })
    }
  }

  onTreeActionPreview(event: any) {
    if (event.row.name !== 'Show more...') {
      const row = event.row;
      if (row.treeStatus === 'collapsed') {
        row.treeStatus = 'loading';

        if (!row.loaded && this.hierarchyDetails.length != row.level) {
          var hie = this.getHierarchyDtlByLevel(this.hierarchyDetails.length - 1 - row.level)
          this.getChildNodes(row, null, (data: any) => {
            const result = data;
            let id: any;
            data = data.content.map((d: PreviewTreeNode) => {
              d.treeStatus = 'collapsed';
              d.parentGrpId = row.grpId;
              d.column = hie.refColumn;
              // d.column = hie ? hie.refColumn : "";
              d.tableId = hie.entityId;
              // d.tableId = hie ? hie.tableId : 0;
              d.name = d.code + (d.name && d.name.length ? `{${d.name}}` : "{}")
              d.grpId = row.grpId + "-" + d.id
              return d;
            });
            if (!!data || data.length > 0) {
              const index: any = data.length - 1;
              const item = data[index];
              id = item.id + 1;
            }
            // this.filterHierarchyPreviewNodes = this.filterHierarchyPreviewNodes.filter((elm: any) => elm.grpId !== row.grpId);
            if (result.totalElements !== 0 && result.totalElements !== data.length) {
              data.push({
                treeStatus: 'collapsed',
                parentGrpId: row.grpId,
                column: hie.refColumn,
                // d.column = hie ? hie.refColumn : "";
                tableId: hie.entityId,
                id: row.id,
                // d.tableId = hie ? hie.tableId : 0;
                name: 'Show more...',
                grpId: row.grpId + "-" + id
                // d.name = d.code + (d.name && d.name.length ? `{${d.name}}` : "{}")
              });
            }
            row.treeStatus = 'expanded';
            row.loaded = true;
            this.hierarchyPreviewNodes = [...this.hierarchyPreviewNodes, ...data];
            this.cd.detectChanges();
          }, hie);
          return;
        }
        row.treeStatus = 'expanded';
        this.hierarchyPreviewNodes = [...this.hierarchyPreviewNodes];
        this.cd.detectChanges();
      } else {
        row.treeStatus = 'collapsed';
        this.hierarchyPreviewNodes = [...this.hierarchyPreviewNodes];
        this.cd.detectChanges();
      }
    }
  }
  resetDatatable() {
    this.hierarchyPreviewNodes = [];
  }

  getHierarchyDtlByLevel(level: number) {
    return this.hierarchyDetails.find(h => h.groupLevel == level) || this.hierarchyDetails[this.hierarchyDetails.length - 1];
  }

  getChildNodes(row: PreviewTreeNode, totalItem: any, callBack: (v: any) => any, hie: HierarchyDetails) {
    if (hie) {
      let cr = {
        filters: [{
          filterType: "CONDITION",
          key: hie.refColumn,
          value: row.id,
          joinType: "NONE",
          operatorType: "EQUALS",
          dataType: "number"
        }]
      } as Criteria;
      if (!row.id) {
        cr = {}
      }
      if (totalItem !== null) {
        console.log((totalItem / 2) || 2, totalItem, '>>>?')
        cr = {
          ...cr,
          pager: {
            pageNumber: Math.ceil(totalItem / 50) || 50,
            pageSize: cr.pager ? cr.pager!.pageSize : 50
          }
        }
      } else {
        cr = {
          ...cr,
          pager: {
            pageNumber: 0,
            pageSize: 50
          }
        }
      }
      this.hierarchyService.loadEntityData(hie.entityId, cr).forEach(callBack);
    } else {
      row.treeStatus = "expanded";
      callBack([]);
    }
  }

  public showMoreHierarchyNodes(row: any) {
    row.entityId = row.tableId;
    row.refColumn = row.column;
    const totalItem = this.hierarchyPreviewNodes.filter((el: any) => el.level === row.level && el.parentGrpId === row.parentGrpId && el.name !== 'Show more...');
    this.getChildNodes(row, totalItem.length, (data: any) => {
      const result = data;
      let id: any;
      data = data.content.map((d: any) => {
        d.treeStatus = 'collapsed';
        d.parentGrpId = row.parentGrpId;
        d.column = row.refColumn;
        // d.column = hie ? hie.refColumn : "";
        d.tableId = row.entityId;
        // d.tableId = hie ? hie.tableId : 0;
        d.name = d.code + (d.name && d.name.length ? `{${d.name}}` : "{}")
        // d.name = d.code + (d.name && d.name.length ? `{${d.name}}` : "{}")
        d.grpId = row.parentGrpId + "-" + d.id
        return d;
      });
      if (!!data || data.length > 0) {
        const index: any = data.length - 1;
        const item = data[index];
        id = item.id + 1;
      }
      this.hierarchyPreviewNodes = this.hierarchyPreviewNodes.filter((elm: any) => elm.grpId !== row.grpId);
      let total = totalItem.length + 50
      total = total > result.totalElements ? result.totalElements : total;
      if (result.totalElements !== 0 && result.totalElements !== total) {
        data.push({
          treeStatus: 'collapsed',
          parentGrpId: row.parentGrpId,
          column: row.refColumn,
          // d.column = hie ? hie.refColumn : "";
          tableId: row.entityId,
          id: row.id,
          // d.tableId = hie ? hie.tableId : 0;
          name: 'Show more...',
          grpId: row.parentGrpId + "-" + id
          // d.name = d.code + (d.name && d.name.length ? `{${d.name}}` : "{}")
        });
      }
      row.treeStatus = 'expanded';
      row.loaded = true;
      this.hierarchyPreviewNodes = [...this.hierarchyPreviewNodes, ...data];
      this.cd.detectChanges();
    }, row);
    return;
  }

  public handleSelectItem(row: any) {
    if (row.name === 'Show more...') {
      this.showMoreHierarchyNodes(row);
      return
    }
  }

  onTreeAction(event: any) {
    const index = event.rowIndex;
    const row = event.row;
    if (row.treeStatus === "collapsed") {
      row.treeStatus = "expanded";
    } else {
      row.treeStatus = "collapsed";
    }
    this.hierarchyLevelNodes = [...this.hierarchyLevelNodes];
  }

  onBind(hie: Hierarchy) {
    this.onClearClick();
    this.id = hie.id;
    this.name = hie.name;
    this.description = hie.description;
    this.hierarchyDetails = [];
    this.selectedModel = this.getModelById(hie.modelId);
    this.getEntitiesByModel(this.selectedModel, hie.entityId, hie, true);
  }
  onClearClick() {
    this.hierarchyDetails = [];
    this.availableEntities = [];
    this.hierarchyLevelNodes = [];
    this.hierarchyPreviewNodes = [];
    this.entityList = [];
    this.selectedModel = null;
    this.name = "";
    this.id = 0;
    this.description = "";
    this.selectedEntity = null;
    this.initForm();
  }
  getModelById(id: number) {
    return this.modelList.find((m: any) => m.id == id) || {} as Model;
  }
  getEntitiesByModel(model: any, entityId?: number, hie?: Hierarchy, isOnBind: boolean = false) {
    this.entityList = [];
    this.entityService.loadEntityByModel(model.id).forEach((a) => {
      this.entityList.push(...a);
      this.EntityListCallBack(entityId ? entityId : 0, hie ? hie : {} as Hierarchy);
    });
  }
  initForm() {
    this.hierarchyForm = this.fb.group({
      name: ["", [Validators.required, Validators.maxLength(50), Validators.minLength(3)]],
      description: ["", Validators.maxLength(250)],
      entityId: [0, Validators.required],
      modelId: [0, Validators.required]
    });
  }
  populateLevelTree() {
    this.hierarchyLevelNodes = [
      ...this.hierarchyDetails.map((hdtl) => {
        return {
          treeStatus: "expanded",
          expandable: false,
          id: hdtl.groupLevel + 1,
          parentId: hdtl.groupLevel == 0 ? null : hdtl.groupLevel,
          tablename: hdtl.entityName,
          tableId: hdtl.entityId,
          name: hdtl.tabledisplayname,
          expanded: true
        } as HierarchyTreeNode;
      }),
    ];
    this.cd.detectChanges();
  }
  EntityListCallBack(entityId: number, hie: Hierarchy) {
    if (entityId) {
      this.selectedEntity = this.getEntityById(entityId);
      this.hierarchyForm = this.fb.group({
        name: [this.name, [Validators.required, Validators.maxLength(50), Validators.minLength(3)]],
        description: [this.description, Validators.maxLength(250)],
        entityId: [entityId, Validators.required],
        modelId: [this.selectedModel?.id, Validators.required]
      });
    }
    if (hie && hie.details) {
      hie.details.sort((a, b) => a.groupLevel - b.groupLevel)
        .forEach(hieDtls => {
          let lastHierarchyDtls = this.getLastHierarchyDtls();
          hieDtls.entity = this.getEntityByTable(hieDtls.entityName);
          hieDtls.entityId = hieDtls.entity.id;
          hieDtls.tabledisplayname = this.getTableDisplayName(
            lastHierarchyDtls?.entity || hieDtls.entity,
            lastHierarchyDtls?.refColumn,
            hieDtls.groupLevel == 0
          );
          this.hierarchyDetails.push(hieDtls);
        });
      this.hierarchyDetails = this.hierarchyDetails.sort((a, b) => b.groupLevel - a.groupLevel);
      this.hierarchyLevels = this.hierarchyDetails.map((el: any) => {return el.groupLevel});
      this.populateLevelTree();
      this.populateAvailableEntities();
      this.setPreviewRootNode(this.getHierarchyDtlByLevel(this.hierarchyDetails.length - 1)?.entity);
      this.cd.detectChanges();
    }
  }
  setPreviewRootNode(entity: Entity) {
    this.hierarchyPreviewNodes = [];
    this.hierarchyPreviewNodes = [...this.hierarchyPreviewNodes, {
      "id": 0, "treeStatus": "collapsed", "column": "", loaded: false, "name": "Root", level: 0, code: "", grpId: this.hierarchyDetails.length + "",
      tableId: entity.id
    }];
  }
  populateAvailableEntities() {
    this.availableEntities = [];
    this.entityService.load(this.getLastHierarchyDtls().entity.id).forEach((a) => {
      let derAttrList = (a as Entity).attributes
        .filter((att) => att.type == "LOOKUP")
        .map((att) => {
          return {
            displayName: att.referencedTableDisplayName,
            name: att.referencedTable,
            id: att.referencedTableId,
            comment: att.name,
            updatedBy: att.displayName
          } as Entity;
        });
      this.availableEntities.push(...derAttrList);
    });
  }
  onItemSelected(event: any) {

  }
  onPaginate(event: any) {
    this.currentCriteria.pager = {
      ...(this.currentCriteria.pager || {}),
      pageNumber: event.offset,
      pageSize: this.pageSize
    };
    if(!!this.model)
    {
      this.loadHeirarchysummaryByModelId(this.model, this.selectedRole, this.currentCriteria);
    }
  }
  onSort(event: any) {

  }
  // public addDropDown(data:any){
  //   this.hierarchyPreviewNodes = this.hierarchyPreviewNodes.map(item => {
  //     if (item.grpId === data.grpId) {
  //       return { ...item, dropDown: true };
  //     }
  //     return {...item,dropDown: false};
  //   });
  // }
  onSelect(value: any, row: any) {
    this.setPermissions(value, row);
  }

  public setPermissions(value: string, data: any) {
    let level = this.hierarchyDetails.length - (data.level);
    let hierarchyDtlId: any = this.hierarchyDetails.find((el: any) => el.groupLevel === level);
    if (data.name === 'Root' && data.level === 0) {
      const maxGroupLevel = Math.max(...this.hierarchyDetails.map(elm => elm.groupLevel));
      hierarchyDtlId = this.hierarchyDetails.find((res: any) => res.groupLevel === maxGroupLevel);
      // hierarchyDtlId = this.hierarchyDetails[index];
    }
    if (!hierarchyDtlId) {
      hierarchyDtlId = this.hierarchyDetails.find((el: any) => el.groupLevel === 0);
    }
    const summaryData: any = this.rows.find((el: any) => el.hierarchy_dtl_id === hierarchyDtlId.id && el.value === data.id);
    const params: permissions = {
      id: summaryData ? summaryData.id : 0,
      hierarchyDtlId: hierarchyDtlId.id,
      permission: value,
      role: this.selectedRole,
      value: data.id
    }
    this.HierarchyService.loadHierarchyByPermissions(params).subscribe({
      next: (res: any) => {
        // this.rows = res.content;
        if (res) {
          this.loadHeirarchysummaryByModelId(this.model, this.selectedRole, this.currentCriteria);
        }
      },
      error: (err: any) => {
        this.rows = [];
        console.log(err)
      }
    })
  }
  getEntityById(id: number) {
    return this.entityList.find((m: any) => m.id == id) || {} as Entity;
  }
  getLastHierarchyDtls() {
    return this.hierarchyDetails.sort((a, b) => a.groupLevel - b.groupLevel)[this.hierarchyDetails.length - 1] || null;
  }
  getEntityByTable(table: string) {
    return this.entityList.find((m: any) => m.name == table) || {} as Entity;
  }
  getTableDisplayName(e: Entity, attribName: string, isRootEntity: boolean) {
    return isRootEntity ? e.displayName : this.getAttribDisplayNameByName(e, attribName) || "";
  }
  getAttribDisplayNameByName(entity: Entity, name: string) {
    return this.entityList.find((e: any) => e.id == entity.id)
      ?.attributes.find((a: any) => a.name == name)
      ?.displayName || "";
  }
  @HostListener("window:resize", ["$event"])
  resize(event: any) {
    this.resizeTable.next(true);
  }
}
