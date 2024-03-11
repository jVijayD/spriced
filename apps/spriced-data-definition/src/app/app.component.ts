import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import {
  AppDataService,
  MenuItem,
} from "@spriced-frontend/shared/spriced-shared-lib";
import { Router, RouterOutlet } from "@angular/router";

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
      name: "Business Rules",
      active: false,
      path: "/spriced-data-definition/rules/rule-management",
    },
    {
      name: "Derived Hierarchy",
      active: false,
      path: "/spriced-data-definition/hierarchy-definition",
    },
    {
      name: "Functions Permission",
      active: false,
      path: "/spriced-data-definition/app-access",
    },
    {
      name: "Model Permission",
      active: false,
      path: "/spriced-data-definition/model-access",
    },
    {
      name: "Hierarchy Permission",
      active: false,
      path: "/spriced-data-definition/hierarchy-permission",
    },
    {
      name: "Transactions",
      active: false,
      path: "/spriced-data-definition/view-transactions",
    },
    {
      name: "Settings",
      active: false,
      path: "/spriced-data-definition/settings",
    },
  ];
  constructor(private appDataService: AppDataService,
    private router:Router
    ) {
    const currentRoute = this.router.url.split('#')[0];
    const activeRoute = this.menuDItems.find((item:any)=>item.path === currentRoute)
    if(activeRoute){
      this.menuDItems.forEach((item: any) => {
        item.active = activeRoute.path === item.path;
      });
    }
    else{
      const nestedRoute = this.router.url.split('/')[2];
      const targetName = nestedRoute === 'rules' ? 'Rules' : nestedRoute === 'derived-hierarchy' ? 'Derived Hierarchy' : null;
      if (targetName) {
        this.menuDItems.forEach((el) => {
          el.active = el.name === targetName;
        });
      }
    }
    this.appDataService.setMenuData(this.menuDItems);
  }
}
