import { Hierarchy } from "./../models/HierarchyTypes.class";
import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from "@angular/core";
import { MatTabsModule } from "@angular/material/tabs";
import { MatTableModule } from "@angular/material/table";
import { MatSelectChange, MatSelectModule } from "@angular/material/select";
import { MatInputModule } from "@angular/material/input";
import { MatIconModule } from "@angular/material/icon";

import {
  DataGridComponent,
  //FilterComponent,
  Header,
  HeaderActionComponent,
  HeaderComponentWrapperComponent,
} from "@spriced-frontend/spriced-ui-lib";
import { ColumnMode, SelectionType, SortType } from "@swimlane/ngx-datatable";
import * as moment from "moment";
import { NgFor } from "@angular/common";
import { Model } from "@spriced-frontend/spriced-common-lib";
import { HierarchyServiceService } from "../service/hierarchy-service.service";
@Component({
  selector: "app-hierarchy-view-tab",
  templateUrl: "./hierarchy-view-tab.component.html",
  styleUrls: ["./hierarchy-view-tab.component.css"],
  standalone: true,
  imports: [
    NgFor,
    HeaderComponentWrapperComponent,
    MatIconModule,
    MatTabsModule,
    MatTableModule,
    MatInputModule,
    MatSelectModule,
    DataGridComponent,
    HeaderActionComponent,
  ],
})
export class HierarchyViewTabComponent implements OnInit, OnDestroy {
  @Output() onEditEventEmitter = new EventEmitter<any>();
  @Output() onDeleteEventEmitter = new EventEmitter<any>();
  @Input()
  modelList!: Model[];
  hierarchyList!: Hierarchy[];

  headers: Header[] = [
    {
      column: "name",
      name: "Name",
      canAutoResize: true,
      isSortable: true,
      flexGrow: 2,
    },
    {
      column: "description",
      name: "Description",
      canAutoResize: true,
      isSortable: false,
      flexGrow: 5,
    },
    {
      column: "updatedBy",
      name: "Updated By",
      canAutoResize: true,
      isSortable: true,
      flexGrow: 2,
    },
    {
      column: "updatedDate",
      name: "Last Updated On",
      canAutoResize: true,
      isSortable: true,
      flexGrow: 2,
      pipe: (data: any) => {
        return moment(data).format("MM/DD/YYYY HH:mm:ss");
      },
    },
  ];
  // displayedColumns = ["name", "description", "view"];
  rows: Hierarchy[] = [];

  columnMode: ColumnMode = ColumnMode.flex;
  selectionType: SelectionType = SelectionType.single;
  sortType = SortType.single;
  isFullScreen = false;
  totalElements = 1000000000000;

  selectedHierarchy!: Hierarchy;
  selectedModel!: Model;

  constructor(private hierarchyService: HierarchyServiceService) {}
  ngOnDestroy() {}
  ngOnInit() {}
  onItemSelected(e: any) {
    this.selectedHierarchy = e;
  }

  loadAllHierarchies(model:Model) {
    this.hierarchyService
      .loadAllHierarchies(model)
      .subscribe((r) => (this.rows = [...r]));
  }

  onEdit() {
    this.hierarchyService.loadHierarchy(this.selectedHierarchy).forEach((e) => {
      this.onEditEventEmitter.emit(e);
    });
  }

  onModelChange(ev: MatSelectChange) {
    this.selectedModel = ev.value;
    this.loadAllHierarchies(this.selectedModel);
  }

  onDelete() {
    this.hierarchyService
      .deleteHierarchy(this.selectedHierarchy)
      .forEach((e) => {
        this.loadAllHierarchies(this.selectedModel);
      });
    this.onDeleteEventEmitter.emit(this.selectedHierarchy);
  }
}
