import { Component, NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MatInputModule } from "@angular/material/input";
import { MatFormField } from "@angular/material/form-field";
import { FormsModule } from "@angular/forms";
import { MatIconModule } from "@angular/material/icon";

@Component({
  selector: "sp-entity-select",
  standalone: true,
  imports: [CommonModule, MatInputModule, FormsModule,MatIconModule],
  templateUrl: "./entity-select.component.html",
  styleUrls: ["./entity-select.component.scss"],
})
export class EntitySelectComponent {
  selectedValue: any = "";
  onTouched() {}
}
