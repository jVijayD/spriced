import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import {
  AppDataService,
  MenuItem,
} from "@spriced-frontend/shared/spriced-shared-lib";
import { RouterOutlet } from "@angular/router";
import { RequestUtilityService } from "@spriced-frontend/spriced-common-lib";

@Component({
  selector: "sp-app",
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  providers: [RequestUtilityService],
  template: `<router-outlet></router-outlet>`,
  styles: [],
})
export class AppComponent {
  menuItems: MenuItem[] = [
    {
      name: "Entity Data",
      path: "/spriced-data",
      active: true,
    },
    // {
    //   name: "Settings",
    //   path: "/spriced-data/settings",
    //   active: false,
    // },
  ];
  constructor(private appDataService: AppDataService) {
    this.appDataService.setMenuData(this.menuItems);
  }
}
