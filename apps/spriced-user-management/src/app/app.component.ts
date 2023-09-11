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
  template: `<router-outlet></router-outlet>`,
  styles: [],
})
export class AppComponent {
  menuItems: MenuItem[] = [
    {
      name: "Menu Item1",
      path: "/spriced-user-management",
      active: true,
    },
    {
      name: "Menu Item2",
      path: "/spriced-user-management/item2",
      active: false,
    },
    {
      name: "Menu Item3",
      path: "/spriced-user-management/item3",
      active: false,
    },
  ];
  constructor(private appDataService: AppDataService) {
    this.appDataService.setMenuData(this.menuItems);
  }
}
