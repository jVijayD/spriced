import { Hierarchy } from "./../models/HierarchyTypes.class";
import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
} from "@angular/core";
import { MatTabsModule } from "@angular/material/tabs";
import { MatTableModule } from "@angular/material/table";
import { MatSelectModule } from "@angular/material/select";
import { MatInputModule } from "@angular/material/input";
import { MatIconModule } from "@angular/material/icon";

import {
  DataGridComponent,
  DialogService,
  Header,
  HeaderActionComponent,
  HeaderComponentWrapperComponent,
  SelectSearchComponent,
} from "@spriced-frontend/spriced-ui-lib";
import { ColumnMode, SelectionType, SortType } from "@swimlane/ngx-datatable";
import * as moment from "moment";
import { NgFor } from "@angular/common";
import { GlobalSettingService, Model, currentStorage } from "@spriced-frontend/spriced-common-lib";
import { HierarchyServiceService } from "../service/hierarchy-service.service";
import { Router } from "@angular/router";
@Component({
  selector: "app-hierarchy-view-tab",
  templateUrl: "./hierarchy-view-tab.component.html",
  styleUrls: ["./hierarchy-view-tab.component.css"],
  standalone: true,
  providers: [DialogService],
  imports: [
    NgFor,
    HeaderComponentWrapperComponent,
    MatIconModule,
    MatTabsModule,
    SelectSearchComponent,
    MatTableModule,
    MatInputModule,
    MatSelectModule,
    DataGridComponent,
    HeaderActionComponent,
  ],
})
export class HierarchyViewTabComponent implements OnInit, OnDestroy {
  @ViewChild('dataGrid') public dataGrid!: DataGridComponent;
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
    {
      column: "description",
      name: "Description",
      canAutoResize: true,
      isSortable: false,
      flexGrow: 5,
    },
    {
      column: "action",
      name: "Hierarchy Grid",
      canAutoResize: true,
      isSortable: false,
      action: true,
      imgsrc: 'assets/images/eye.png',
      flexGrow: 1,
    },
  ];
  // displayedColumns = ["name", "description", "view"];
  rows: Hierarchy[] = [];

  columnMode: ColumnMode = ColumnMode.flex;
  selectionType: SelectionType = SelectionType.single;
  sortType = SortType.single;
  isFullScreen = false;
  totalElements = 1000000000000;

  selectedHierarchy: Hierarchy | null = null;
  selectedModel!: Model;
  currentStorage!: currentStorage;
  currentSort: any = [];

  constructor(
    private hierarchyService: HierarchyServiceService,
    private dialogService: DialogService,
    private globalSetting: GlobalSettingService,
    private router: Router) { }
  ngOnDestroy() {
    this.currentStorage = {...this.currentStorage, modelId: this.selectedModel.id, sorters: this.currentSort};
    this.globalSetting.setCurrentStorage('hierarchyView', this.currentStorage);
   }
  ngOnInit() { 
    const currentStorage = this.globalSetting.getCurrentStorage('hierarchyView');
    this.currentStorage = !!currentStorage ? currentStorage : this.currentStorage;
    this.currentSort = this.currentStorage.sorters || [];
    window.onbeforeunload = () => this.ngOnDestroy();
  }
  onItemSelected(e: any) {
    this.selectedHierarchy = e;
    const groupId = e.modelId;
    const id = e.entityId;
    const hierarchyId = e.id;
    // setTimeout(()=>{
    //   this.router.navigate(["/spriced-data-definition/derived-hierarchy/" + hierarchyId + "/" + groupId + "/", id]);
    // },300)
  }

  navigate(e:any){
    this.hierarchyService.loadHierarchy(e).subscribe((el: any) => {
      const level = el.details.length - 1;
      const id = el.details.find((res: any) => res.groupLevel === level);
      this.selectedHierarchy = e;
      const groupId = e.modelId;
      const hierarchyId = e.id;
      this.router.navigate(["/spriced-data-definition/derived-hierarchy/" + hierarchyId + "/" + groupId + "/", id.entityId]);
    })
    
  }
  loadAllHierarchies(model: Model) {
    this.hierarchyService
      .loadAllHierarchies(model)
      .subscribe((r) => (this.rows = [...r]));
  }

  onEdit() {
    if (!this.selectedHierarchy) {
      return
    }
    this.hierarchyService.loadHierarchy(this.selectedHierarchy).forEach((e) => {
      this.onEditEventEmitter.emit(e);
    });
  }

  onModelChange(ev: { value: Model }, text?: any) {
    !!text ? this.dataGrid.defaultSorts = [] : '';
    !!this.currentStorage && (this.currentStorage.sorters = []);
    this.selectedModel = ev.value;
    this.loadAllHierarchies(this.selectedModel);
  }

  onSort(event: any)
  {
    this.currentSort = event.sorts[0];
  }

  showConfirmDeleteDialogue() {
    const dialogResult = this.dialogService.openConfirmDialoge({
      title: "Confirm",
      icon: "public",
      message:
        "Do you really want to delete the derived hierarchy ?",
      maxWidth: 400,
    });

    dialogResult.afterClosed().subscribe((val) => {
      if (val && this.selectedHierarchy) {
        this
          .hierarchyService
          .deleteHierarchy(this.selectedHierarchy)
          .forEach((e) => {
            this.loadAllHierarchies(this.selectedModel);
            this.selectedHierarchy = null;
          });
        this.onDeleteEventEmitter.emit(this.selectedHierarchy);
      }
    });
  }

  onDelete() {
    if (this.selectedHierarchy) {
      this.showConfirmDeleteDialogue();
    }
  }
}
