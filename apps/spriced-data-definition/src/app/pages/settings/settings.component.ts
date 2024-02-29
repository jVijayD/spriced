import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MatSidenavModule } from "@angular/material/sidenav";
import { OneColComponent } from "@spriced-frontend/spriced-ui-lib";
import { MatIconModule } from "@angular/material/icon";
import { EntityOrderComponent } from "./entity-order/entity-order.component";
@Component({
  selector: "sp-settings",
  standalone: true,
  imports: [
    CommonModule,
    MatSidenavModule,
    EntityOrderComponent,
    OneColComponent,
    MatIconModule,
  ],
  templateUrl: "./settings.component.html",
  styleUrls: ["./settings.component.scss"],
})
export class SettingsComponent {
  menuItem: string = "entityOrder";
  menuChanged(item: string) {
    this.menuItem = item;
  }
}
