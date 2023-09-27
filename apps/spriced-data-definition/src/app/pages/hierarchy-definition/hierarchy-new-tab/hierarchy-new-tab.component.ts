import { HierarchyDetails, Hierarchy } from "./../models/HierarchyTypes.class";
import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { MatIconModule } from "@angular/material/icon";
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
  providers:[SnackBarService],
  imports: [
    CommonModule,
    NgFor,
    FormsModule,
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
    MatSelectModule,
    MatInputModule,
    SnackbarModule,
  ],
})
export class HierarchyNewTabComponent implements OnInit {
  @Output() onSaveEventEmitter = new EventEmitter<any>();
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
  description: string = "";

  constructor(
    private entityService: EntityService,
    private snackBarService: SnackBarService,
    private hierarchyService: HierarchyServiceService
  ) {}
  ngOnInit() {}

  loadEntities(model: Model) {}
  onClearClick() {
    this.hierarchyDetails = [];
    this.availableEntities = [];
    this.entityList = [];
    this.selectedModel = null;
    this.name = "";
    this.description = "";
    this.selectedEntity = null;
  }
  onSaveClick() {
    if (
      !this.selectedEntity ||
      !this.selectedModel ||
      !this.hierarchyDetails ||
      this.hierarchyDetails.length == 0
    ) {
      return;
    }
    let hie: Hierarchy = {
      name: this.name,
      id: 0,
      entityId: this.selectedEntity?.id,
      modelId: this.selectedModel?.id,
      description: "",
      updatedDate: new Date(),
      updatedBy: "",
      details: this.hierarchyDetails,
    };
    this.hierarchyService.saveHierarchy(hie).forEach((r) => {
      this.snackBarService.success("Derived Hierarchy Saved Successfully");
      this.onClearClick()
      this.onSaveEventEmitter.emit(0);
    });
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
      entity: entity,
      refColumn: "RefId -- tobe set",
    });
    this.availableEntities = [];
    this.entityService.load(entity.id).forEach((a) => {
      let derAttrList = (a as Entity).attributes
        .filter((att) => att.type == "LOOKUP")
        .map((att) => {
          return {
            displayName: att.referencedTableDisplayName,
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
  onRemoveClick(ev: any) {
    this.hierarchyDetails = this.hierarchyDetails.sort((a,b)=>a.level - b.level)
    let dtl = this.hierarchyDetails.pop();
    dtl = this.hierarchyDetails.pop();
    this.addToLevel(dtl?.entity);
    this.hierarchyDetails = [...this.hierarchyDetails];
  }
  onEntityChange(ev: MatSelectChange) {
    this.selectedEntity = ev.value as Entity;
    this.hierarchyDetails = [];
    this.addToLevel(this.selectedEntity);
    console.log(this.selectedEntity);
  }
}
