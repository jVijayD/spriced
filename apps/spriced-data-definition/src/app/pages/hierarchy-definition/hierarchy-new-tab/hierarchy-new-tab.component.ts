import {
  HierarchyDetails,
  Hierarchy,
  HierarchyTreeNode,
  PreviewTreeNode,
} from "./../models/HierarchyTypes.class";
import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from "@angular/core";
import { MatIconModule } from "@angular/material/icon";
import { MatSelectChange, MatSelectModule } from "@angular/material/select";
import { MatTableModule } from "@angular/material/table";

import { MatTabsModule } from "@angular/material/tabs";
import {
  Entity,
  EntityService, Criteria,
  Model,
  Attribute,
} from "@spriced-frontend/spriced-common-lib";
import { MatListModule } from "@angular/material/list";
import { CommonModule, NgFor } from "@angular/common";
import { MatCardModule } from "@angular/material/card";
import {
  DataGridComponent,
  DataGridTreeComponent,
  Direction,
  Head,
  Header,
  HeaderActionComponent,
  HeaderComponentWrapperComponent,
  SelectSearchComponent,
  SnackBarService,
  SnackbarModule,
  VboxComponent,
  sorter,
} from "@spriced-frontend/spriced-ui-lib";
import {
  ColumnMode,
  NgxDatatableModule,
  SelectionType,
  SortType,
} from "@swimlane/ngx-datatable";
import { FormsModule } from "@angular/forms";
import { MatInputModule } from "@angular/material/input";
import { MatButtonModule } from "@angular/material/button";
import { MatFormFieldModule } from "@angular/material/form-field";
import { HierarchyServiceService } from "../service/hierarchy-service.service";
@Component({
  selector: "app-hierarchy-new-tab",
  templateUrl: "./hierarchy-new-tab.component.html",
  styleUrls: ["./hierarchy-new-tab.component.css"],
  standalone: true,
  providers: [SnackBarService],
  imports: [
    CommonModule,
    NgFor,
    FormsModule,
    VboxComponent,
    DataGridTreeComponent,
    DataGridComponent,
    MatListModule,
    HeaderComponentWrapperComponent,
    NgxDatatableModule,
    MatCardModule,
    MatIconModule, SelectSearchComponent,
    MatTabsModule,
    MatFormFieldModule,
    HeaderActionComponent,
    MatButtonModule,
    MatTableModule,
    MatSelectModule,
    MatInputModule,
    SnackbarModule,
  ],
})
export class HierarchyNewTabComponent implements OnInit {
  dir:Direction=Direction.ASC;
  @Input()
  selectedHierarchy!: Hierarchy | null;
  @Output() onSaveEventEmitter = new EventEmitter<any>();

  levelHeaders: Head[] = [
    {
      column: "tablename",
      name: "Name",
      canAutoResize: true,
      isSortable: true,
      isTreeColumn: true,
    },
  ];
  headers: Header[] = [
    {
      column: "tablename",
      name: "Name",
      canAutoResize: true,
      isSortable: false,
      flexGrow: 2,
    },
  ];
  selectionType: SelectionType = SelectionType.single;
  columnMode: ColumnMode = ColumnMode.flex;
  sortType = SortType.single;
  @Input()
  modelList!: Model[];
  ColumnMode = ColumnMode;
  entityList!: Entity[];
  // detailsList: HierarchyDetails[] = [];
  availableEntities: Entity[] = [];

  hierarchyDetails: HierarchyDetails[] = [];
  hierarchyLevelNodes: HierarchyTreeNode[] = [];
  hierarchyPreviewNodes: PreviewTreeNode[] = [];
  // = [
  //   { "id": 1, "treeStatus": "expanded", "tablename": "", "name": "ROOT", tableId: this.hierarchyDetails[this.hierarchyDetails.length - 1].tableId },
  // ]

  selectedModel!: Model | null;
  selectedEntity!: Entity | null;
  id: number = 0;
  name: string = "";
  description: string = "";
  comboSorters: sorter[] = [{ property: "name", direction: Direction.ASC }];

  constructor(
    private cd: ChangeDetectorRef,
    private entityService: EntityService,
    private snackBarService: SnackBarService,
    private hierarchyService: HierarchyServiceService,
  ) { }
  ngOnInit() { }

  loadEntities(model: Model) { }
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
    // this.comboSorters 
  }
  validateBeforeSave() {
    if (!this.selectedEntity) {
      this.snackBarService.error("Please select an entity");
    }
    if (!this.name) {
      this.snackBarService.error(
        "Please enter a name for the derived Hierarchy"
      );
    }
    if (!this.selectedModel) {
      this.snackBarService.error("Please select an entity");
    }
    if (this.hierarchyDetails.length <= 1) {
      this.snackBarService.error("Please add grouping levels");
    }
  }

  onSaveClick() {
    if (
      !this.selectedEntity ||
      !this.selectedModel ||
      !this.name ||
      !this.hierarchyDetails ||
      this.hierarchyDetails.length == 0 ||
      this.hierarchyDetails.length == 1
    ) {
      this.validateBeforeSave();
      return;
    }
    let hie: Hierarchy = {
      name: this.name,
      id: this.id,
      entityId: this.selectedEntity?.id,
      modelId: this.selectedModel?.id,
      description: this.description,
      updatedDate: new Date(),
      updatedBy: "",
      model: null,
      entity: null,
      details: this.hierarchyDetails,
    };
    this.hierarchyService.saveHierarchy(hie).forEach((r) => {
      this.snackBarService.success("Derived Hierarchy Saved Successfully");
      this.onSaveEventEmitter.emit(this.selectedModel);
      this.onClearClick();
    });
  }

  getHierarchyDtlByLevel(level: number) {
    return this.hierarchyDetails.find(h => h.groupLevel == level) || this.hierarchyDetails[this.hierarchyDetails.length - 1];
  }
  getAttribDisplayNameByName(entity: Entity, name: string) {
    return this.entityList.find(e => e.id == entity.id)
      ?.attributes.find(a => a.name == name)
      ?.displayName || "";
  }
  getLastHierarchyDtls() {
    return this.hierarchyDetails.sort((a, b) => a.groupLevel - b.groupLevel)[this.hierarchyDetails.length - 1];
  }
  addToLevel(entity: Entity, attribName: string) {
    let lastHierarchy = this.hierarchyDetails.length ? this.getLastHierarchyDtls() : null;
    let lastHierarchyEntity = this.hierarchyDetails.length ? this.getLastHierarchyDtls().entity : entity
    let hDtl = {
      id: 0,
      hierarchyId: this.id,
      groupLevel: this.hierarchyDetails.length,
      treeStatus: "expanded",
      expanded: false,
      tablename: entity.name,
      tableId: entity.id,
      tabledisplayname: this.getTableDisplayName(lastHierarchyEntity, attribName, this.hierarchyDetails.length),
      localColumn: "id",
      entity: entity,
      refColumn: entity.comment ? entity.comment : attribName,
    } as HierarchyDetails;
    // if (this.hierarchyDetails.length - 1 >= 0) {
    // var hie = this.getHierarchyDtlByLevel(this.hierarchyDetails.length - 1)
    // hie && entity.comment ? hie.refColumn = entity.comment : "";
    // }
    if (lastHierarchy) {
      lastHierarchy.refColumn = hDtl.refColumn;
    }
    // lastHierarchyEntity.
    this.availableEntities = [];
    this.entityService.load(entity.id).forEach((a) => {
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
    this.hierarchyDetails = [...this.hierarchyDetails, hDtl];
    this.populateLevelTree();
    this.setPreviewRootNode(entity);
  }

  setPreviewRootNode(entity: Entity) {
    this.hierarchyPreviewNodes = [];
    this.hierarchyPreviewNodes = [...this.hierarchyPreviewNodes, {
      "id": 0, "treeStatus": "collapsed", "column": "", loaded: false, "name": "ROOT", level: 0, code: "", grpId: this.hierarchyDetails.length + "",
      tableId: entity.id
    }];
  }
  onModelChange(ev: MatSelectChange) {
    this.selectedModel = ev.value as Model;
    this.availableEntities = [];
    if (this.selectedModel) {
      this.getEntitiesByModel(this.selectedModel);
    }
  }
  getTableDisplayName(e: Entity, attribName: string, groupLevel: number) {
    return groupLevel == 0
      ? e.displayName
      : this.getAttribDisplayNameByName(e, attribName)
      || "";
  }
  getEntitiesByModel(model: Model, entityId?: number, hie?: Hierarchy, isOnBind: boolean = false) {
    this.entityList = [];
    this.entityService.loadEntityByModel(model.id).forEach((a) => {
      this.entityList.push(...a);
      if (entityId) {
        this.selectedEntity = this.getEntityById(entityId);
      }
      if (hie && hie.details) {
        hie.details
          .sort((a, b) => a.groupLevel - b.groupLevel)
          .forEach((hieDtls): void => {
            hieDtls.entity = this.getEntityByTable(hieDtls.tablename);
            hieDtls.tabledisplayname = this.getTableDisplayName(this.getLastHierarchyDtls()?.entity|| hieDtls.entity, this.getLastHierarchyDtls()?.refColumn, hieDtls.groupLevel);
            hieDtls.tableId = (hieDtls.entity).id;
            this.hierarchyDetails.push(hieDtls);
          });
        this.hierarchyDetails = this.hierarchyDetails.sort((a, b) => b.groupLevel - a.groupLevel);
        this.populateLevelTree();
        if (isOnBind) {
          this.setPreviewRootNode(this.getHierarchyDtlByLevel(this.hierarchyDetails.length - 1)?.entity);
        }
        this.cd.detectChanges();
      }
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
          tablename: hdtl.tablename,
          tableId: hdtl.tableId,
          name: hdtl.tabledisplayname,
          expanded: true
        } as HierarchyTreeNode;
      }),
    ];
    this.cd.detectChanges();
  }
  onRemoveClick(ev: any) {
    this.hierarchyDetails = this.hierarchyDetails.sort(
      (a, b) => a.groupLevel - b.groupLevel
    );
    let dtl1 = this.hierarchyDetails.pop();
    let dtl = this.hierarchyDetails.pop() || {} as HierarchyDetails;
    this.addToLevel(dtl.entity, dtl.refColumn);
    this.hierarchyDetails = [
      ...this.hierarchyDetails.sort((a, b) => b.groupLevel - a.groupLevel),
    ];
    this.populateLevelTree();
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
  getModelById(id: number) {
    return this.modelList.filter((m) => m.id == id)[0];
  }
  getEntityById(id: number) {
    return this.entityList.filter((m) => m.id == id)[0];
  }
  getEntityByTable(table: string) {
    return this.entityList.filter((m) => m.name == table)[0];
  }
  onEntityChange(ev: MatSelectChange) {
    this.selectedEntity = ev.value as Entity;
    this.hierarchyDetails = [];
    this.addToLevel(this.selectedEntity, "");
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
  onTreeActionPreview(event: any) {
    const index = event.rowIndex;
    const row = event.row;
    if (row.treeStatus === 'collapsed') {
      row.treeStatus = 'loading';

      if (!row.loaded && this.hierarchyDetails.length  != row.level) {
        var hie = this.getHierarchyDtlByLevel(this.hierarchyDetails.length - 1 - row.level)
        this.getChildNodes(row, (data: any) => {
          data = data.content.map((d: PreviewTreeNode) => {
            d.treeStatus = 'collapsed';
            d.parentGrpId = row.grpId;
            d.column = hie.refColumn;
            // d.column = hie ? hie.refColumn : "";
            d.tableId = hie.tableId;
            // d.tableId = hie ? hie.tableId : 0;
            d.name = d.code + (d.name && d.name.length ? `{${d.name}}` : "{}")
            d.grpId = row.grpId + "-" + d.id
            return d;
          });
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


  getChildNodes(row: PreviewTreeNode, callBack: Function, hie: HierarchyDetails) {
    // const hie = this.getHierarchyDtlByLevel(this.hierarchyDetails.length - 1 - row.level);
    if (hie) {
      let cr = {} as Criteria;
      if (row.id && hie?.refColumn) {
        cr.filters = [{
          filterType: "CONDITION",
          key: hie.refColumn,
          value: row.id,
          joinType: "NONE",
          operatorType: "EQUALS",
          dataType: "number"
        }]
      }
      this.hierarchyService.loadEntityData(hie.tableId, cr).forEach(element => {
        callBack(element);
      });
    } else {
      row.treeStatus = "expanded";
      callBack([]);
    }
  }
}


