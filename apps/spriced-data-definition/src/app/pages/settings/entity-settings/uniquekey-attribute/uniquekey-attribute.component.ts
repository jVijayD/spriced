import { Component, ViewChild } from "@angular/core";
import { CommonModule } from "@angular/common";
import {
  DataGridComponent,
  Header,
  HeaderActionComponent,
  HeaderComponentWrapperComponent,
  OneColComponent,
} from "@spriced-frontend/spriced-ui-lib";
import { ColumnMode, SelectionType } from "@swimlane/ngx-datatable";
import { MatSelectModule } from "@angular/material/select";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { ModelService, EntityService } from "@spriced-frontend/spriced-common-lib";
import { NgxMatSelectSearchModule } from "ngx-mat-select-search";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatButtonModule } from "@angular/material/button";

@Component({
  selector: "sp-uniquekey-attribute",
  standalone: true,
  imports: [
    CommonModule,
    OneColComponent,
    DataGridComponent,
    HeaderActionComponent,
    HeaderActionComponent,
    MatFormFieldModule,
    MatIconModule,
    MatSelectModule,
    HeaderComponentWrapperComponent,
    NgxMatSelectSearchModule,
    MatCheckboxModule,
    MatButtonModule
  ],
  templateUrl: "./uniquekey-attribute.component.html",
  styleUrls: ["./uniquekey-attribute.component.scss"],
})
export class UniquekeyAttributeComponent {
  selectedEntity: any;
  entityList: any;
  filteredEntityList: any;
  modelList: any;
  filteredModelList: any;
  constructor( private modelService: ModelService,
    private enitityService: EntityService,){}
  headers: Header[] = [
    {
      column: "Key",
      name: "key",
      canAutoResize: true,
      isSortable: true,
      hidden: true,
      width: 100,
    },
  ];
  columnMode: ColumnMode = ColumnMode.force;
  selectionType: SelectionType = SelectionType.single;
  isFullScreen = false;
  totalElements = 10000;
  rows: any[] = [];
  selectedItem: any = null;
  filterData: any;

  @ViewChild(DataGridComponent)
  dataGrid!: DataGridComponent;
  pageNo = 0;
  pageSize = 10;
  temp: any = [];
  query?: any;
  selectedModel: any;

  ngOnInit() {
      this.modelService.loadAllModels().subscribe((result: any) => {
        this.modelList = result;
        this.filteredModelList = this.modelList;
        this.selectedModel = this.modelList[0]?.id;
        this.onModelChange({value:this.selectedModel})
      })
  }

  onAdd() {}
  onEdit() {}
  onDelete() {}
  onItemSelected(event: any) {}

  onModelChange(ev: any) {
    this.selectedModel = ev.value;
    this.enitityService
      .loadEntityByModel(this.selectedModel)
      .subscribe((result: any) => {
        this.entityList = result;
        this.filteredEntityList = result;
        this.filteredEntityList.sort((a:any,b:any) => a.displayName.localeCompare(b.displayName));
        this.selectedEntity = this.filteredEntityList[0]?.id;
        this.onEntitySelectionChange({ value: this.selectedEntity });
      });
  }

  onEntitySelectionChange(entity: any) {
    this.selectedEntity = entity.value;
  }
  filterModelSelection(text: any) {
    this.filteredModelList = this.modelList.filter((item: any) => {
      return (
        item.displayName
          .trim()
          .toLowerCase()
          .indexOf(text.trim().toLowerCase()) != -1
      );
    });
  }
  filterEntitySelection(text: any) {
    this.filteredEntityList = this.entityList.filter((item: any) => {
      return (
        item.displayName
          .trim()
          .toLowerCase()
          .indexOf(text.trim().toLowerCase()) != -1
      );
    });
  }
  updateCheckedOptions(event:any,value:any)
  {
    console.log(event,value)
  }
  onCancel()
  {

  }
}
