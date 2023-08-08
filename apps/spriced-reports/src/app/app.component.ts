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
      name: "Dn-Pricing Entity Audit",
      path: "/spriced-reports/f4adaabb-7e11-470a-b9e8-0f65964f80ee",
      active: true,
    },
    {
      name: "EBU CTT Part Price Comparison",
      path: "/spriced-reports/9f9f13bb-44ae-4dee-adbf-ca7bd87d15cd",
      active: false,
    },
    {
      name: "Price History",
      path: "/spriced-reports/fc48374f-b618-4b9f-9bc3-ba8e88f6e3c8",
      active: false,
    },
  ];
  constructor(private appDataService: AppDataService) {
    this.appDataService.setMenuData(this.menuItems);
  }
}
