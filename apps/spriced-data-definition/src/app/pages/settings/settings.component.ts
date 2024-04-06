import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MatSidenavModule } from "@angular/material/sidenav";
import { OneColComponent, SnackBarService } from "@spriced-frontend/spriced-ui-lib";
import { MatIconModule } from "@angular/material/icon";
import { EntitySettingsComponent } from "./entity-settings/entity-settings.component";
import { DateTimeSettingsComponent } from "./date-time-settings/date-time-settings.component";
@Component({
  selector: "sp-settings",
  standalone: true,
  imports: [
    CommonModule,
    MatSidenavModule,
    OneColComponent,
    MatIconModule,
    EntitySettingsComponent,
    DateTimeSettingsComponent
  ],
  templateUrl: "./settings.component.html",
  styleUrls: ["./settings.component.scss"],
})
export class SettingsComponent {
  menuItem: string = "entityOrder";
  public menuChanged(item: string) {
    this.menuItem = item;
  }
}
