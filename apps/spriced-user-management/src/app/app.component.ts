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
  template: `<router-outlet></router-outlet>`,
  styles: [],
})
export class AppComponent {
  menuDItems: MenuItem[] = [
    {
      name: "App Access Management",
      active: true,
      path: "/spriced-user-management/app-access",
    },
  ];
  constructor(private appDataService: AppDataService) {
    this.appDataService.setMenuData(this.menuDItems);
  }
}

