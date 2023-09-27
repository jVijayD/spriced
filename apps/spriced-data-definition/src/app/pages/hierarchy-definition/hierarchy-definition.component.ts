import {
  AfterViewInit,
  Component,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
} from "@angular/core";
import { MatTabsModule } from "@angular/material/tabs";
import { MatSelectModule } from "@angular/material/select";
import { MatInputModule } from "@angular/material/input";
import { MatIconModule } from "@angular/material/icon";
import { HierarchyViewTabComponent } from "./hierarchy-view-tab/hierarchy-view-tab.component";
import { HierarchyNewTabComponent } from "./hierarchy-new-tab/hierarchy-new-tab.component";
import { Hierarchy } from "./models/HierarchyTypes.class";
import { Subscription } from "rxjs";
import { EntityService } from "../../services/entity.service";
import { ModelService } from "../../services/model.service";
import { Model } from "@spriced-frontend/spriced-common-lib";
@Component({
  selector: "app-hierarchy-definition",
  templateUrl: "./hierarchy-definition.component.html",
  styleUrls: ["./hierarchy-definition.component.css"],
  standalone: true,
  imports: [
    HierarchyViewTabComponent,
    HierarchyNewTabComponent,
    MatIconModule,
    MatTabsModule,
  ],
})
export class HierarchyDefinitionComponent
  implements OnInit, AfterViewInit, OnDestroy
{
  selectedTabIndex = 0;
  selectedHierarchy!: Hierarchy;
  subscriptions: Subscription[] = [];

  modelList!: Model[];

  @ViewChild(HierarchyViewTabComponent)
  viewTab!: HierarchyViewTabComponent;
  @ViewChild(HierarchyNewTabComponent)
  newTab!: HierarchyNewTabComponent;

  constructor(
    private entityService: EntityService,
    private modelService: ModelService
  ) {}

  ngOnDestroy(): void {
    this.subscriptions.forEach((e) => e.unsubscribe());
  }

  ngOnInit() {
    this.subscriptions.push(
      this.modelService.loadAllModels().subscribe((result: any) => {
        this.modelList = result;
      })
    );
  }
  ngAfterViewInit(): void {
    this.subscriptions.push(
      this.viewTab.onEditEventEmitter.subscribe((selection: Hierarchy) => {
        this.selectedTabIndex = 1;
        this.selectedHierarchy = selection;
      })
    );
    this.subscriptions.push(
      this.viewTab.onDeleteEventEmitter.subscribe((selection: Hierarchy) => {
        this.selectedHierarchy = selection;
        this.onDelete(selection);
      })
    );
  }
  onDelete(sel: Hierarchy) {
    console.log(sel);
  }
}
