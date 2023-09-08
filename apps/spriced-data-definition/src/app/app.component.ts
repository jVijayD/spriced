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
    // {
    //   name: "Explorer",
    //   active: false,
    //   path: "/spriced-data-definition/model-list",
    // },
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
      name: "Functions Permissions",
      active: false,
      path: "/spriced-data-definition/app-access",
    },
  ];
  constructor(private appDataService: AppDataService) {
    this.appDataService.setMenuData(this.menuDItems);
  }
}
