import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatSelectModule } from "@angular/material/select";
import { MatOptionModule } from "@angular/material/core";
import { MatSelectSearchComponent, NgxMatSelectSearchModule } from "ngx-mat-select-search";
import { ColumnMode, NgxDatatableModule, SelectionType, SortType } from "@swimlane/ngx-datatable";
import { DataGridComponent } from "@spriced-frontend/spriced-ui-lib";
import { EntityService, ModelService } from "@spriced-frontend/spriced-common-lib";
import { HierarchyServiceService } from "../hierarchy-definition/service/hierarchy-service.service";
import { debounceTime } from "rxjs";
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule } from "@angular/forms";

@Component({
  selector: "sp-hierarchy-permission",
  standalone: true,
  imports: [CommonModule, MatFormFieldModule, MatSelectModule, MatOptionModule, NgxMatSelectSearchModule, DataGridComponent, FormsModule, ReactiveFormsModule],
  templateUrl: "./hierarchy-permission.component.html",
  styleUrls: ["./hierarchy-permission.component.scss"],
})
export class HierarchyPermissionComponent implements OnInit {
  public listForm!: FormGroup;
  public filteredModels: any;
  public modelList: any;
  public hierarchyList: any;
  public entityList: any;
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
  public defaultModelId: any;
  public defaultEntity: any = 'ALL';
  public defaultHierarchy: any = 'ALL';
  public row: any = [];
  public hierarchyPreviewNodes: any;
  selectionType: SelectionType = SelectionType.single;
  sortType = SortType.single;
  columnMode: ColumnMode = ColumnMode.force;
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
      column: "member",
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

  constructor(
    private modelService: ModelService,
    private entityService: EntityService,
    private HierarchyService: HierarchyServiceService,
    private fb: FormBuilder
  ) { 
    this.listForm = this.fb.group({
      modelFilter: new FormControl(''),
      entityFilter: new FormControl(''),
      hierarchyFilter: new FormControl('')
    });
  }

  ngOnInit(): void {
    this.getAllModels();

    this.listForm.valueChanges.pipe(
      debounceTime(500)
    ).subscribe((item: any) => {
      this.filteredModels = this.filterItems(this.modelList, item.modelFilter);
      this.filteredEntities = this.filterItems(this.entityList, item.entityFilter);
      this.filteredHierarchy = this.filterItems(this.hierarchyList, item.hierarchyFilter);
    })
  }

  // Generic filtering function
  filterItems(items: any[], searchText: string): any[] {
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
      this.getEntityByGroupId(this.defaultModelId);
      this.getAllHierarchyByModelId(res[0]);
    })
  }

  public getEntityByGroupId(id: any) {
    this.entityService.loadEntityByModel(id).subscribe((el: any) => {
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
    })
  }

  public handleEntityByModels(id: any) {
    const model = this.modelList.find((res: any) => res.id === id)
    this.getEntityByGroupId(id);
    this.getAllHierarchyByModelId(model);
  }

  public handleHierarchyByEntity(item: any) {

  }

  public handleHierarchy(id: any) {
    const hierarchy = this.hierarchyList.find((el: any) => el.id === id);
    this.HierarchyService.loadHierarchy(hierarchy).subscribe((res: any) => {
      console.log(res, '>????');
    })
  }
}
