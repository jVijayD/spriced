import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import {MatExpansionModule} from '@angular/material/expansion';
import { EntityOrderComponent } from "./entity-order/entity-order.component";
@Component({
  selector: "sp-entity-settings",
  standalone: true,
  imports: [CommonModule,MatExpansionModule,EntityOrderComponent],
  templateUrl: "./entity-settings.component.html",
  styleUrls: ["./entity-settings.component.scss"],
})
export class EntitySettingsComponent {panelOpenState = false;}
