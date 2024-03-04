import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MatExpansionModule } from "@angular/material/expansion";
import { EntityOrderComponent } from "./entity-order/entity-order.component";
import { UniquekeyAttributeComponent } from "./uniquekey-attribute/uniquekey-attribute.component";
import { MatIconModule } from "@angular/material/icon";
@Component({
  selector: "sp-entity-settings",
  standalone: true,
  imports: [
    CommonModule,
    MatExpansionModule,
    EntityOrderComponent,
    UniquekeyAttributeComponent,
    MatIconModule
  ],
  templateUrl: "./entity-settings.component.html",
  styleUrls: ["./entity-settings.component.scss"],
})
export class EntitySettingsComponent {
  panelOpenState = false;
}
