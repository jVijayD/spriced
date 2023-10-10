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
} from "@spriced-frontend/spriced-common-lib";
import { MatListModule } from "@angular/material/list";
import { CommonModule, NgFor } from "@angular/common";
import { MatCardModule } from "@angular/material/card";
import {
  DataGridComponent,
  DataGridTreeComponent,
  Head,
  Header,
  HeaderActionComponent,
  HeaderComponentWrapperComponent,
  SelectSearchComponent,
  SnackBarService,
  SnackbarModule,
  VboxComponent,
} from "@spriced-frontend/spriced-ui-lib";
import {
  ColumnMode,
  NgxDatatableModule,
  SelectionType,
  SortType,
} from "@swimlane/ngx-datatable";
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  Validators,
  ReactiveFormsModule
} from "@angular/forms";
import { MatInputModule } from "@angular/material/input";
import { MatButtonModule } from "@angular/material/button";
import { MatFormFieldModule } from "@angular/material/form-field";
import { HierarchyServiceService } from "../service/hierarchy-service.service";
@Component({
  selector: "app-hierarchy-new-tab",
  templateUrl: "./hierarchy-new-tab.component.html",
  styleUrls: ["./hierarchy-new-tab.component.scss"],
  standalone: true,
  providers: [SnackBarService],
  imports: [
    CommonModule,
    NgFor,
    ReactiveFormsModule,
    FormsModule,
    VboxComponent,
    DataGridTreeComponent,
    DataGridComponent,
    MatListModule,
    HeaderComponentWrapperComponent,
    NgxDatatableModule,
    MatCardModule,
    MatIconModule,
    SelectSearchComponent,
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
export class HierarchyNewTabComponent {
  @Input() modelList!: Model[];
  @Input() selectedHierarchy!: Hierarchy | null;
  @Output() onSaveEventEmitter = new EventEmitter<any>();
  entityList!: Entity[];
  availableEntities: Entity[] = [];
  hierarchyDetails: HierarchyDetails[] = [];
  hierarchyLevelNodes: HierarchyTreeNode[] = [];
  hierarchyPreviewNodes: PreviewTreeNode[] = [];
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
  id: number = 0;
  name: string = "";
  description: string = "";
  selectionType: SelectionType = SelectionType.single;
  columnMode: ColumnMode = ColumnMode.flex;
  sortType = SortType.single;
  ColumnMode = ColumnMode;
  hierarchyForm!: FormGroup;
  selectedModel!: Model | null;
  selectedEntity!: Entity | null;

  constructor(
    private cd: ChangeDetectorRef,
    private entityService: EntityService,
    private snackBarService: SnackBarService,
    private hierarchyService: HierarchyServiceService,
    private fb: FormBuilder,
  ) {
    this.onClearClick();
  }
  initForm() {
    this.hierarchyForm = this.fb.group({
      name: ["", [Validators.required, Validators.maxLength(50), Validators.minLength(3)]],
      description: ["", Validators.maxLength(250)],
      entityId: [0, Validators.required],
      modelId: [0, Validators.required]
    });
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
  onBind(hie: Hierarchy) {
    this.onClearClick();
    this.id = hie.id;
    this.name = hie.name;
    this.description = hie.description;
    this.hierarchyDetails = [];
    this.selectedModel = this.getModelById(hie.modelId);
    this.getEntitiesByModel(this.selectedModel, hie.entityId, hie, true);
    }

  onSaveClick() {
    if (!this.selectedEntity || !this.selectedModel) { return; }
    let hie: Hierarchy = {
      name: this.hierarchyForm.controls["name"].value,
      id: this.id,
      entityId: this.selectedEntity.id,
      modelId: this.selectedModel.id,
      description: this.hierarchyForm.controls["description"].value,
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
    return this.hierarchyDetails.sort((a, b) => a.groupLevel - b.groupLevel)[this.hierarchyDetails.length - 1] || null;
  }
  addToLevel(entity: Entity, attribName: string) {
    const lastHierarchy = this.getLastHierarchyDtls();
    const lastHierarchyEntity = lastHierarchy ? lastHierarchy.entity : entity
    let hDtl = {
      id: 0,
      hierarchyId: this.id,
      groupLevel: this.hierarchyDetails.length,
      treeStatus: "expanded",
      expanded: false,
      tablename: entity.name,
      tableId: entity.id,
      tabledisplayname: this.getTableDisplayName(lastHierarchyEntity, attribName, this.hierarchyDetails.length == 0),
      localColumn: "id",
      entity: entity,
      refColumn: entity.comment ? entity.comment : attribName,
    } as HierarchyDetails;
    if (lastHierarchy) {
      lastHierarchy.refColumn = hDtl.refColumn;
    }
    this.hierarchyDetails = [...this.hierarchyDetails, hDtl];
    this.populateLevelTree();
    this.populateAvailableEntities();
    this.setPreviewRootNode(entity);
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
  getTableDisplayName(e: Entity, attribName: string, isRootEntity: boolean) {
    return isRootEntity ? e.displayName : this.getAttribDisplayNameByName(e, attribName) || "";
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
          hieDtls.entity = this.getEntityByTable(hieDtls.tablename);
          hieDtls.tableId = hieDtls.entity.id;
          hieDtls.tabledisplayname = this.getTableDisplayName(
            lastHierarchyDtls?.entity || hieDtls.entity,
            lastHierarchyDtls?.refColumn,
            hieDtls.groupLevel == 0
          );
          this.hierarchyDetails.push(hieDtls);
        });
      this.hierarchyDetails = this.hierarchyDetails.sort((a, b) => b.groupLevel - a.groupLevel);
      this.populateLevelTree();
      this.populateAvailableEntities();
      this.setPreviewRootNode(this.getHierarchyDtlByLevel(this.hierarchyDetails.length - 1)?.entity);
      this.cd.detectChanges();
    }
  }
  getEntitiesByModel(model: Model, entityId?: number, hie?: Hierarchy, isOnBind: boolean = false) {
    this.entityList = [];
    this.entityService.loadEntityByModel(model.id).forEach((a) => {
      this.entityList.push(...a);
      this.EntityListCallBack(entityId ? entityId : 0, hie ? hie : {} as Hierarchy);
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
    let dtl1 = this.hierarchyDetails.pop() || {} as HierarchyDetails;
    // let dtl = this.hierarchyDetails.pop() || {} as HierarchyDetails;
    // this.addToLevel(dtl.entity, dtl1.refColumn);
    this.populateAvailableEntities();
    this.hierarchyDetails = [
      ...this.hierarchyDetails.sort((a, b) => b.groupLevel - a.groupLevel),
    ];
    this.populateLevelTree();
  }

  getModelById(id: number) {
    return this.modelList.find((m) => m.id == id) || {} as Model;
  }
  getEntityById(id: number) {
    return this.entityList.find((m) => m.id == id) || {} as Entity;
  }
  getEntityByTable(table: string) {
    return this.entityList.find((m) => m.name == table) || {} as Entity;
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

      if (!row.loaded && this.hierarchyDetails.length != row.level) {
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
  getChildNodes(row: PreviewTreeNode, callBack: (v: any) => any, hie: HierarchyDetails) {
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
      this.hierarchyService.loadEntityData(hie.tableId, cr).forEach(callBack);
    } else {
      row.treeStatus = "expanded";
      callBack([]);
    }
  }
}


