import { ChangeDetectorRef, Component, EventEmitter, Output, ViewChild } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Head, Header, HeaderActionComponent, HeaderComponentWrapperComponent, SnackBarService, ThreeColComponent } from "@spriced-frontend/spriced-ui-lib";
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
  @Output() getEntityByHierarchyItem = new EventEmitter();
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
  selectedItems: any = [];
  removeBufferItems: any;
  searchInputSubject = new Subject<string>();
  currentRowId: any = undefined;
  disableRowId: any = [];
  selected: any;


  constructor(
    private cd: ChangeDetectorRef,
    private entityService: EntityService,
    private aroute: ActivatedRoute,
    private entityDataService: DataEntityService,
    private snackbarService: SnackBarService,
  ) { }

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
      tableId: entity.id
    }];
  }

  setPreviewRootNode(entity: any) {
    this.hierarchyPreviewNodes = [];
    this.filterHierarchyPreviewNodes = [];
    this.currentEntity = entity;
    const entityData: any = this.hierarchyDetails.filter((el: any) => el.groupLevel === 0);
    this.hierarchyPreviewNodes = [...this.hierarchyPreviewNodes, {
      "id": 0, "treeStatus": "collapsed", "column": "", loaded: false, "name": "ROOT", level: 0, code: "", grpId: this.hierarchyDetails.length + "",
      tableId: entity.id
    }];
    this.filterHierarchyPreviewNodes = this.hierarchyPreviewNodes;
    const hierarchyNodes = { row: this.filterHierarchyPreviewNodes[0] };
    this.onTreeActionPreview(hierarchyNodes, this.displayFormat);
    this.handleSelectItem(this.filterHierarchyPreviewNodes[0]);
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
    const lastHierarchy = this.getLastHierarchyDtls();
    const lastHierarchyEntity = lastHierarchy ? lastHierarchy.entity : this.currentEntity
    this.hierarchyLevelNodes = [
      ...this.hierarchyDetails.map((hdtl) => {
        return {
          treeStatus: "expanded",
          expandable: false,
          id: hdtl.groupLevel + 1,
          parentId: hdtl.groupLevel == 0 ? null : hdtl.groupLevel,
          tablename: hdtl.entityName,
          tableId: hdtl.entityId,
          tabledisplayname: this.getTableDisplayName(lastHierarchyEntity, '', this.hierarchyDetails.length == 0),
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
    if (event.row.name !== 'Show more...') {
      const row = event.row;
      if (row.treeStatus === 'collapsed') {
        row.treeStatus = 'loading';

        if (!row.loaded && this.hierarchyDetails.length != row.level) {
          var hie = this.getHierarchyDtlByLevel(this.hierarchyDetails.length - 1 - row.level)
          this.getChildNodes(row, null, (data: any) => {
            const result = data;
            data.content = data.content.sort((a: any, b: any) => {
              return a.updated_date - b.updated_date;
            });
            let id: any;
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
        if (row.treeStatus === 'collapsed') {
          this.filterHierarchyPreviewNodes.map((item: any) => row.level === 0 ? item.treeStatus = 'collapsed' : (item.level !== 0 && item.parentGrpId === row.grpId && (item.treeStatus = 'collapsed')));
        }
        this.hierarchyPreviewNodes = [...this.hierarchyPreviewNodes];
        this.filterHierarchyPreviewNodes = [...this.filterHierarchyPreviewNodes];
        this.cd.detectChanges();
      }
    }
  }
  getChildNodes(row: any, totalItem: any, callBack: (v: any) => any, hie: any) {
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

      this.entityDataService.loadEntityData(hie.entityId, cr).forEach(callBack);
    } else {
      row.treeStatus = "expanded";
      callBack([]);
    }
  }

  public showMoreHierarchyNodes(row: any) {
    row.entityId = row.tableId;
    row.refColumn = row.column;
    const totalItem = this.filterHierarchyPreviewNodes.filter((el: any) => el.level === row.level && el.parentGrpId === row.parentGrpId && el.name !== 'Show more...');
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
        d.name = this.getDisplayProp(d, this.displayFormat)
        // d.name = d.code + (d.name && d.name.length ? `{${d.name}}` : "{}")
        d.grpId = row.parentGrpId + "-" + d.id
        return d;
      });
      if (!!data || data.length > 0) {
        const index: any = data.length - 1;
        const item = data[index];
        id = item.id + 1;
      }
      this.filterHierarchyPreviewNodes = this.filterHierarchyPreviewNodes.filter((elm: any) => elm.grpId !== row.grpId);
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
      this.filterHierarchyPreviewNodes = [...this.filterHierarchyPreviewNodes, ...data];
      this.cd.detectChanges();
    }, row);
    return;
  }

  public handleSelectItem(row: any) {
    if (row.name === 'Show more...') {
      this.showMoreHierarchyNodes(row);
      return
    }
    if ([undefined, null].includes(this.currentRowId) || row.id !== this.currentRowId) {
      this.currentRowId = row.id;
      let hierarchyRow = { ...row };
      this.table.selected = [row];
      const level = this.hierarchyDetails.length - (row.level + 1);
      const tableName = this.hierarchyDetails.find((el: any) => el.groupLevel === level);
      row = this.hierarchyDetails.find(elm => elm.groupLevel === level);
      if (!!row.id) {
        let entity: any = this.entityList.find((item: any) => item.id == row.entityId);
        const filter = row.groupLevel !== (this.hierarchyDetails.length - 1) ? [{ "filterType": "CONDITION", "joinType": "NONE", "operatorType": "EQUALS", "key": row?.refColumn, "value": hierarchyRow?.id, "dataType": "string" }] : [];
        entity = { ...entity, filter: filter ? filter : '', displayName: tableName.tabledisplayname };
        this.getEntityByHierarchyItem.emit(entity);
      }
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
      this.selectedItems.push(item);
    }
    else {
      const indexToRemove = this.selectedItems.indexOf(item);
      if (indexToRemove !== -1) {
        this.selectedItems.splice(indexToRemove, 1);
      }
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
    return this.selectedItems.some((el: any) => el === row);
  }

  public removeHierarchyData() {
    console.log(this.selectedItems, this.table);
    this.removeBufferItems = this.selectedItems;
    this.selectedItems.forEach((el: any) => {
      if (el) {
        this.disableRowId.push(el.grpId);
      }
    });
    this.selectedItems = [];
    // this.filterHierarchyPreviewNodes = this.filterHierarchyPreviewNodes;
    // const ids = this.selectedItems.map((el: any) => el.id);
    // const slicedData = this.sliceDataByIds(this.filterHierarchyPreviewNodes, this.selectedItems?.id);
  }

  // sliceDataByIds(data: any, ids: any) {
  //   return data.filter((item: any) => !ids.includes(item.id));
  // }

  public updateHierarchyData() {
    let param: any = [];
    console.log(this.selectedItems);
    const item = this.selectedItems[0];
    let level: any = this.hierarchyDetails.length - (item.level + 1);
    const row = this.hierarchyDetails.find(elm => elm.groupLevel === level);
    // const param = {
    //   "entityName": row.entityName,
    //   "refColumn": row.refColumn,
    //   "memberId": +this.removeBufferItems.id,
    //   "newParentId": +item.id
    // }
    this.removeBufferItems.forEach((elm: any) => {
      if (elm) {
        param.push({
          "entityName": row.entityName,
          "refColumn": row.refColumn,
          "memberId": +elm.id,
          "newParentId": +item.id
        })
      }
    })
    this.entityDataService.updateHierarchy({ data: param }).subscribe((res: any) => {
      console.log(res);
      if (this.hierarchyId && res) {
        this.entityDataService.loadHierarchy(this.hierarchyId).subscribe((e: any) => {
          console.log(e, '>??');
          this.populateLevelTree();
          this.populateAvailableEntities();
          this.setPreviewRootNode(this.getHierarchyDtlByLevel(this.hierarchyDetails.length - 1)?.entity);
        });
      }
      else {
        this.snackbarService.error("Hierarchy record updated failed");
      }
    })
    this.selectedItems = [];
    this.removeBufferItems = null;
    this.disableRowId = [];
  }

  public getDisplayProp(option: any, prop: any) {
    let props: any = prop.split('|');
    return props.reduce((prev: any, cur: any) => {
      const value = prev === "-##"
        ? option[cur]
        : `${prev == null ? "" : prev} ${this.renderDataWithCurlyBrace(
          option[cur]
        )}`;
      return value;
    }, "-##");
  }

  private renderDataWithCurlyBrace(data: any) {
    return data == null ? "" : "{" + data + "}";
  }

}
