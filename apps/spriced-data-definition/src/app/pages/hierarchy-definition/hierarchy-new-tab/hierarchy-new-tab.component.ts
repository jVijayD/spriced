import { HierarchyDetails, Hierarchy } from "./../models/HierarchyTypes.class";
import { Component, Input, OnInit } from "@angular/core";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatSelectChange, MatSelectModule } from "@angular/material/select";
import { MatTableModule } from "@angular/material/table";

import { MatTabsModule } from "@angular/material/tabs";
import {
  Entity,
  EntityService,
  Model,
} from "@spriced-frontend/spriced-common-lib";
import { MatListModule } from "@angular/material/list";
import { CommonModule, NgFor } from "@angular/common";
import { MatCardModule } from "@angular/material/card";
import {
  DataGridComponent,
  Header,
  HeaderActionComponent,
  HeaderComponentWrapperComponent,
  VboxComponent,
} from "@spriced-frontend/spriced-ui-lib";
import {
  ColumnMode,
  NgxDatatableModule,
  SelectionType,
  SortType,
} from "@swimlane/ngx-datatable";
import { MatButtonModule } from "@angular/material/button";
import { MatFormFieldModule } from "@angular/material/form-field";
@Component({
  selector: "app-hierarchy-new-tab",
  templateUrl: "./hierarchy-new-tab.component.html",
  styleUrls: ["./hierarchy-new-tab.component.css"],
  standalone: true,
  imports: [
    CommonModule,
    NgFor,
    VboxComponent,
    DataGridComponent,
    MatListModule,
    HeaderComponentWrapperComponent,
    NgxDatatableModule,
    MatCardModule,
    MatIconModule,
    MatTabsModule,
    MatFormFieldModule,
    HeaderActionComponent,
    MatButtonModule,
    MatTableModule,
    MatInputModule,
    MatSelectModule,
  ],
})
export class HierarchyNewTabComponent implements OnInit {
  headers: Header[] = [
    {
      column: "tabledisplayname",
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
  selectedModel!: Model | null;
  selectedEntity!: Entity | null;
  name: string = "";

  constructor(private entityService: EntityService) {}
  ngOnInit() {}

  loadEntities(model: Model) {}
  onClearClick(el: any) {
    this.hierarchyDetails = [];
    this.availableEntities = [];
    this.entityList = [];
    this.selectedModel = null;
    this.selectedEntity = null;
  }
  onSaveClick(el: any) {
    if (
      !this.selectedEntity ||
      !this.selectedModel ||
      !this.hierarchyDetails ||
      this.hierarchyDetails.length == 0
    ) {
      return;
    }
    let hie: Hierarchy = {
      name: "",
      id: 0,
      entityId: this.selectedEntity?.id,
      modelId: this.selectedModel?.id,
      description: "",
      updatedDate: new Date(),
      updatedBy: "",
      details: this.hierarchyDetails,
    };
    console.log(hie);
  }
  addToLevel(entity: Entity) {
    this.hierarchyDetails.push({
      id: 0,
      hierarchyId: 0,
      level: this.hierarchyDetails.length,
      tablename: entity.name,
      tabledisplayname: entity.displayName,
      localColumn: "id",
      refColumn: "RefId -- tobe set",
    });
    this.availableEntities = [];
    this.entityService.load(entity.id).forEach((a) => {
      let derAttrList = (a as Entity).attributes
        .filter((att) => att.type == "LOOKUP")
        .map((att) => {
          return {
            displayName: att.referencedTableName,
            name: att.referencedTable,
            id: att.referencedTableId,
          } as Entity;
        });
      this.availableEntities.push(...derAttrList);
    });
    this.hierarchyDetails = [
      ...this.hierarchyDetails.sort((e, c) => c.level - e.level),
    ];
    console.log(this.hierarchyDetails);
  }
  onModelChange(ev: MatSelectChange) {
    this.selectedModel = ev.value as Model;
    this.availableEntities = [];
    this.entityList = [];
    this.entityService.loadEntityByModel(this.selectedModel.id).forEach((a) => {
      this.entityList.push(...a);
    });
    console.log(ev.value);
  }
  onEntityChange(ev: MatSelectChange) {
    this.selectedEntity = ev.value as Entity;
    this.hierarchyDetails = [];
    this.addToLevel(this.selectedEntity);
    console.log(this.selectedEntity );
  }
}
