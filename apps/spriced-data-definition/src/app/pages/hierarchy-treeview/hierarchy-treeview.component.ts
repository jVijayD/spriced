import { ChangeDetectorRef, Component, EventEmitter, Output, ViewChild } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Head, Header, HeaderActionComponent, HeaderComponentWrapperComponent, ThreeColComponent } from "@spriced-frontend/spriced-ui-lib";
import { ColumnMode, DatatableComponent, NgxDatatableModule, SelectionType, SortType } from "@swimlane/ngx-datatable";
import { MatCheckboxModule } from "@angular/material/checkbox";
import {
  MatExpansionModule,
  MatExpansionPanel,
} from "@angular/material/expansion";
import { MatFormFieldModule } from "@angular/material/form-field";
import { Subject, debounceTime, distinctUntilChanged } from "rxjs";
import { Criteria, DataEntityService, EntityService } from "@spriced-frontend/spriced-common-lib";
import { MatIconModule } from "@angular/material/icon";
import { MatSelectModule } from "@angular/material/select";
import { MatButtonModule } from "@angular/material/button";
import { MatInputModule } from "@angular/material/input";
import { MatToolbarModule } from "@angular/material/toolbar";
import { ActivatedRoute } from "@angular/router";

@Component({
  selector: "sp-hierarchy-treeview",
  standalone: true,
  imports: [CommonModule, ThreeColComponent, NgxDatatableModule, MatCheckboxModule, MatExpansionModule, MatFormFieldModule, MatIconModule, MatSelectModule, MatButtonModule, MatInputModule, MatToolbarModule, HeaderActionComponent, HeaderComponentWrapperComponent],
  templateUrl: "./hierarchy-treeview.component.html",
  styleUrls: ["./hierarchy-treeview.component.scss"],
})
export class HierarchyTreeviewComponent {
  @ViewChild(DatatableComponent)
  table!: DatatableComponent;
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
  @Output() getEntity = new EventEmitter();
  columnMode: ColumnMode = ColumnMode.flex;
  sortType = SortType.single;
  modelList!: any[];
  ColumnMode = ColumnMode;
  entityList!: any[];
  currentCriteria!: Criteria;
  filterHierarchyPreviewNodes: any[] = [];
  // detailsList: HierarchyDetails[] = [];
  availableEntities: any[] = [];
  hierarchyPreviewNodes: any[] = [];
  hierarchyLevelNodes: any[] = [];
  hierarchyDetails: any[] = [];
  hierarchyId!: any;
  selectedModel!: any | null;
  selectedEntity!: any | null;
  id: number = 0;
  name: string = "";
  description: string = "";
  displayFormat: any;
  entityId: any;
  currentEntity: any;
  selectedItems: any;
  removeBufferItems: any;
  searchInputSubject = new Subject<string>();
  currentRowId!: number;
  disableRowId: any;


  constructor(
    private cd: ChangeDetectorRef,
    private entityService: EntityService,
    private aroute: ActivatedRoute,
    private entityDataService: DataEntityService
  ){}

  ngOnInit() {
    this.hierarchyId = this.aroute.snapshot.paramMap.get("hierarchyId") ? Number(this.aroute.snapshot.paramMap.get("hierarchyId")) : null;

    this.searchInputSubject.pipe(
      debounceTime(500), // Adjust debounce time in milliseconds as needed
      distinctUntilChanged()
    ).subscribe((value: any) => {
      if (value !== '') {
        this.filterHierarchyPreviewNodes = this.filterDatatable(this.hierarchyPreviewNodes, value);
        let array: any = [];
        this.filterHierarchyPreviewNodes.forEach((item: any) => {
          const data = this.hierarchyPreviewNodes.find((el: any) => el.grpId === item.parentGrpId);
          const check = array.find((el: any) => el.grpId === data.grpId);
          if (!check) {
            array.push(data);
          }
          array.push(item);
          return
        });
        array = array.filter((el: any) => el.name !== 'ROOT');
        const uniqueIds = this.filterUniqueById(array);
        if (uniqueIds && uniqueIds.length > 0) {
          uniqueIds.forEach((item: any) => {
            const parentChild = this.hierarchyPreviewNodes.filter((el: any) => el.parentGrpId === item.grpId);
            if (parentChild && parentChild.length > 0) {
              array.push(...parentChild);
            }
            return
          });
        }
        this.setFilterPreview(this.getHierarchyDtlByLevel(this.hierarchyDetails.length - 1)?.entity, 'expanded', array);
      }
      else {
        this.filterHierarchyPreviewNodes = this.hierarchyPreviewNodes;
      }
      this.cd.detectChanges();
    });
  }

  filterUniqueById(array: any[]): any[] {
    const idCount: any = {};
    const result = [];

    for (const item of array) {
      const id = item.level === 1 ? item.grpId : item.parentGrpId;

      if (!idCount[id]) {
        // If it's the first occurrence of this ID, add it to the result array
        result.push(item);
        idCount[id] = true;
      } else if (item.level === 2) {
        // If it's a level 2 item and the ID is already present, remove the level 1 item
        const existingIndex = result.findIndex((existingItem) => existingItem.level === 1 && existingItem.grpId === id);
        if (existingIndex !== -1) {
          result.splice(existingIndex, 1);
        }
        // Add the level 2 item
        result.push(item);
      }
    }

    return result;
  }

  onBind(hie: any, prop: any) {
    const props = prop === "code"
      ? "code" : prop === "codename"
        ? "code|name" : "name|code";
    this.displayFormat = props;
    this.entityId = hie.entityId;
    this.id = hie.id;
    this.name = hie.name;
    this.description = hie.description;
    this.hierarchyDetails = [];
    this.selectedModel = hie.modelId;
    this.getEntitiesByModel(this.selectedModel, hie.entityId, hie, true);
  }

  getHierarchyDtlByLevel(level: number) {
    return this.hierarchyDetails.find(h => h.groupLevel == level);
  }

  getLastHierarchyDtls() {
    return this.hierarchyDetails.sort((a, b) => a.groupLevel - b.groupLevel)[this.hierarchyDetails.length - 1] || null;
  }

  setFilterPreview(entity: any, status: any, previewNodes: any) {
    this.filterHierarchyPreviewNodes = [];
    const entityData: any = this.hierarchyDetails.filter((el: any) => el.groupLevel === 0);
    this.filterHierarchyPreviewNodes = [...previewNodes, {
      "id": 0, "treeStatus": status, "column": "", loaded: true, "name": "ROOT", level: 0, code: "", grpId: this.hierarchyDetails.length + "",
      tableId: entityData[0].entityId
    }];
  }

  setPreviewRootNode(entity: any) {
    this.hierarchyPreviewNodes = [];
    this.filterHierarchyPreviewNodes = [];
    this.currentEntity = entity;
    const entityData: any = this.hierarchyDetails.filter((el: any) => el.groupLevel === 0);
    this.hierarchyPreviewNodes = [...this.hierarchyPreviewNodes, {
      "id": 0, "treeStatus": "collapsed", "column": "", loaded: false, "name": "ROOT", level: 0, code: "", grpId: this.hierarchyDetails.length + "",
      tableId: entityData[0].entityId
    }];
    this.filterHierarchyPreviewNodes = this.hierarchyPreviewNodes;
  }

  getAttribDisplayNameByName(entity: any, name: string) {
    return this.entityList.find(e => e.id == entity.id)
      ?.attributes.find((a: any) => a.name == name)
      ?.displayName || "";
  }

  getTableDisplayName(e: any, attribName: string, isRootEntity: boolean) {
    return isRootEntity ? e.displayName : this.getAttribDisplayNameByName(e, attribName) || "";
  }

  EntityListCallBack(entityId: number, hie: any) {
    if (entityId) {
      this.selectedEntity = this.getEntityById(entityId);
    }
    if (hie && hie.details) {
      hie.details.sort((a: any, b: any) => a.groupLevel - b.groupLevel)
        .forEach((hieDtls: any) => {
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
      this.populateLevelTree();
      this.populateAvailableEntities();
      this.setPreviewRootNode(this.getHierarchyDtlByLevel(this.hierarchyDetails.length - 1)?.entity);
      this.cd.detectChanges();
    }
  }

  populateAvailableEntities() {
    this.availableEntities = [];
    this.entityService.load(this.getLastHierarchyDtls().entity.id).forEach((a) => {
      let derAttrList = (a as any).attributes
        .filter((att: any) => att.type == "LOOKUP")
        .map((att: any) => {
          return {
            displayName: att.referencedTableDisplayName,
            name: att.referencedTable,
            id: att.referencedTableId,
            comment: att.name,
            updatedBy: att.displayName
          } as any;
        });
      this.availableEntities.push(...derAttrList);
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
        } as any;
      }),
    ];
    this.cd.detectChanges();
  }

  getEntitiesByModel(modelId: number, entityId?: number, hie?: any, isOnBind: boolean = false) {
    this.entityList = [];
    this.entityService.loadEntityByModel(modelId).forEach((a) => {
      this.entityList.push(...a);
      this.EntityListCallBack(entityId ? entityId : 0, hie ? hie : {} as any);
    });
  }

  getEntityByTable(table: string) {
    return this.entityList.find((m) => m.name == table) || {} as any;
  }

  getEntityById(id: number) {
    return this.entityList.filter((m) => m.id == id)[0];
  }

  onTreeActionPreview(event: any, prop: any) {
    const row = event.row;
    if (row.treeStatus === 'collapsed') {
      row.treeStatus = 'loading';

      if (!row.loaded && this.hierarchyDetails.length != row.level) {
        var hie = this.getHierarchyDtlByLevel(this.hierarchyDetails.length - 1 - row.level)
        this.getChildNodes(row, (data: any) => {
          data = data.content.map((d: any) => {
            d.treeStatus = 'collapsed';
            d.parentGrpId = row.grpId;
            d.column = hie.refColumn;
            // d.column = hie ? hie.refColumn : "";
            d.tableId = hie.entityId;
            // d.tableId = hie ? hie.tableId : 0;
            d.name = this.getDisplayProp(d, prop)
            // d.name = d.code + (d.name && d.name.length ? `{${d.name}}` : "{}")
            d.grpId = row.grpId + "-" + d.id
            return d;
          });
          row.treeStatus = 'expanded';
          row.loaded = true;
          this.hierarchyPreviewNodes = [...this.hierarchyPreviewNodes, ...data];
          this.filterHierarchyPreviewNodes = [...this.filterHierarchyPreviewNodes, ...data];
          this.cd.detectChanges();
        }, hie);
        return;
      }
      row.treeStatus = 'expanded';
      this.hierarchyPreviewNodes = [...this.hierarchyPreviewNodes];
      this.filterHierarchyPreviewNodes = [...this.filterHierarchyPreviewNodes];
      this.cd.detectChanges();
    } else {
      row.treeStatus = 'collapsed';
      this.hierarchyPreviewNodes = [...this.hierarchyPreviewNodes];
      this.filterHierarchyPreviewNodes = [...this.filterHierarchyPreviewNodes];
      this.cd.detectChanges();
    }
  }
  getChildNodes(row: any, callBack: (v: any) => any, hie: any) {
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
      this.entityDataService.loadEntityData(hie.entityId, cr).forEach(callBack);
    } else {
      row.treeStatus = "expanded";
      callBack([]);
    }
  }

  public handleSelectItem(row: any) {
    console.log(this.hierarchyDetails,'>>>>');
    if(row.id !== this.currentRowId)
    {
      this.currentRowId = row.id;
      const entity:any = this.hierarchyDetails.filter((item:any)=>item.entityId == row.tableId);
      const filter = row.name !== 'ROOT' ? [{ "filterType": "CONDITION", "joinType": "NONE", "operatorType": "EQUALS", "key": 'code', "value": row?.code, "dataType": "string" }] : [];
      this.getEntity.emit({entity, filter});
    }
    // this.onItemSelected({ selected: [row] });
  }

  public onItemSelected(event: any) {
    const item = event.selected[0];
    if (item.name !== 'ROOT') {
      const filter = [{ "filterType": "CONDITION", "joinType": "NONE", "operatorType": "EQUALS", "key": 'code', "value": item.id, "dataType": "number" }]
      this.entityDataService.filterDataByHierarchy.next(filter);
    }
    else {
      this.entityDataService.filterDataByHierarchy.next([]);
    }

  }

  public filterDatatable(nodes: any, item: any) {
    const value = item.toLowerCase();
    return nodes.filter((node: any) => {
      const itemCode = node.name.toLowerCase();
      const children = node.children;

      // Recursively search through children nodes
      if (children && children.length > 0) {
        node.children = this.filterDatatable(children, value);
      }

      // Include the node in the results if it or any of its children match the search key
      return itemCode.includes(value) || (node.children && node.children.length > 0);
    });
  }

  public handleCheckBox(event: any, item: any) {
    if (event.checked) {
      this.selectedItems = item;
    }
    else {
      this.selectedItems = null;
    }
    // const indexOfItem = this.selectedItems.findIndex(selectedItem => selectedItem.id === item.id);

    // // If item is not already selected, add it to the selectedItems array
    // if (indexOfItem === -1) {
    //   this.selectedItems.push(item);
    // } else {
    //   // If item is already selected, remove it from the selectedItems array
    //   this.selectedItems.splice(indexOfItem, 1);
    // }
  }

  // Function to check if a row is selected
  isRowSelected(row: any): boolean {
    return this.selectedItems === row;
  }

  public removeHierarchyData() {
    console.log(this.selectedItems, this.table);
    this.removeBufferItems = this.selectedItems;
    this.disableRowId = this.selectedItems.id;
    this.selectedItems = null;
    // this.filterHierarchyPreviewNodes = this.filterHierarchyPreviewNodes;
    // const ids = this.selectedItems.map((el: any) => el.id);
    // const slicedData = this.sliceDataByIds(this.filterHierarchyPreviewNodes, this.selectedItems?.id);
  }

  // sliceDataByIds(data: any, ids: any) {
  //   return data.filter((item: any) => !ids.includes(item.id));
  // }

  public updateHierarchyData() {
    console.log(this.selectedItems);
    const item = this.selectedItems;
    const param = {
      "entityName": this.currentEntity.name,
      "refColumn": item.column,
      "memberId": item.id,
      "newParentId": item.parentGrpId
    }
    this.entityDataService.updateHierarchy(param).subscribe((res: any) => {
      console.log(res);
    })
    this.selectedItems = null;
    this.removeBufferItems = null;
  }

  public getDisplayProp(option: any, prop: any) {
    let props: any = prop.split('|');
    return props.reduce((prev: any, cur: any) => {
      const value = prev === "-##"
        ? option[cur]
        : `${prev == null ? "" : prev} ${this.renderDataWithCurlyBrace(
          option[cur]
        )}`;
      console.log(value)
      return value;
    }, "-##");
  }

  private renderDataWithCurlyBrace(data: any) {
    return data == null ? "" : "{" + data + "}";
  }

}
