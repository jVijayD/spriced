import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import {
  AppDataService,
  MenuItem,
} from "@spriced-frontend/spriced-common-lib";
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
      name: "Home",
      path: "/spriced-reports",
      active: true,
    },
  ];
  constructor(private appDataService: AppDataService) {
    this.appDataService.setMenuData(this.menuItems);
  }
}
