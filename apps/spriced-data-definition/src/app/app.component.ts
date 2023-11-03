import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import {
  AppDataService,
  MenuItem,
} from "@spriced-frontend/shared/spriced-shared-lib";
import { RouterOutlet } from "@angular/router";

@Component({
  selector: "sp-app",
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  providers: [],
  template: `<router-outlet></router-outlet>`,
  styles: [],
})
export class AppComponent {
  menuDItems: MenuItem[] = [
    {
      name: "Model Management",
      active: true,
      path: "/spriced-data-definition/model",
    },
    {
      name: "Entity Management",
      active: false,
      path: "/spriced-data-definition/entity",
    },
    {
      name: "Rules",
      active: false,
      path: "/spriced-data-definition/rules/rule-management",
    },
    {
      name: "Model Permission",
      active: false,
      path: "/spriced-data-definition/model-access",
    },
    {
      name: "Functions Permission",
      active: false,
      path: "/spriced-data-definition/app-access",
    },
    {
      name: "Transactions",
      active: false,
      path: "/spriced-data-definition/view-transactions",
    },
    {
      name: "Derived Hierarchy",
      active: false,
      path: "/spriced-data-definition/hierarchy-definition",
    },
    // {
    //   name: "Hierarchy Permission",
    //   active: false,
    //   path: "/spriced-data-definition/hierarchy-permission",
    // },
  ];
  constructor(private appDataService: AppDataService) {
    this.appDataService.setMenuData(this.menuDItems);
  }
}
