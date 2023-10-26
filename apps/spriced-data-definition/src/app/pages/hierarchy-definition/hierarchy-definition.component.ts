import {
  AfterViewInit,
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
} from "@angular/core";
import {
  MatTabChangeEvent,
  MatTabGroup,
  MatTabsModule,
} from "@angular/material/tabs";
import { MatIconModule } from "@angular/material/icon";
import { HierarchyViewTabComponent } from "./hierarchy-view-tab/hierarchy-view-tab.component";
import { HierarchyNewTabComponent } from "./hierarchy-new-tab/hierarchy-new-tab.component";
import { Hierarchy } from "./models/HierarchyTypes.class";
import { Subscription } from "rxjs";
import { EntityService } from "../../services/entity.service";
import { ModelService } from "../../services/model.service";
import { Model } from "@spriced-frontend/spriced-common-lib";
import { MatSelectChange } from "@angular/material/select";
import { KeycloakService } from "keycloak-angular";
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
  selectedHierarchy: Hierarchy | null = null;
  subscriptions: Subscription[] = [];

  modelList!: Model[];

  @ViewChild(HierarchyViewTabComponent)
  viewTab!: HierarchyViewTabComponent;

  @ViewChild("HierarchytabGroup")
  HierarchytabGroup!: MatTabGroup;

  @ViewChild(HierarchyNewTabComponent)
  newTab!: HierarchyNewTabComponent;

  constructor(
    private entityService: EntityService,
    private modelService: ModelService,
    protected readonly keycloak: KeycloakService,
  ) {}

  ngOnDestroy(): void {
    this.subscriptions.forEach((e) => e.unsubscribe());
  }

  ngOnInit() {
    this.subscriptions.push(
      this.modelService.loadAllModels().subscribe((result: any) => {
        this.modelList = result;
        if(this.modelList.length>0){
          this.viewTab.selectedModel =   this.modelList[0];
          this.viewTab.onModelChange({value:this.viewTab.selectedModel});
        }
      })
    );
  }
  ngAfterViewInit(): void {
    this.subscriptions.push(
      this.viewTab.onEditEventEmitter.subscribe((selection: Hierarchy) => {
        this.selectedTabIndex = 1;
        this.selectedHierarchy = selection;
        this.newTab.onBind(selection);
      })
    );
    this.subscriptions.push(
      this.viewTab.onDeleteEventEmitter.subscribe((selection: Hierarchy) => {
        this.selectedHierarchy = selection;
        this.onDelete(selection);
      })
    );
    this.subscriptions.push(
      this.newTab.onSaveEventEmitter.subscribe((a:Model) => {
        this.HierarchytabGroup.selectedIndex = 0;
        this.selectedTabIndex = 0;
        this.viewTab.selectedModel = a;
        this.viewTab.loadAllHierarchies(a);
      })
    );
  }
  onDelete(sel: Hierarchy) {
    this.selectedHierarchy = null;
  }

  onTabSelChange(ev: MatTabChangeEvent) {
    this.selectedTabIndex = ev.index;
  }
}
