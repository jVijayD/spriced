import { Component, Input } from "@angular/core";
import { CommonModule } from "@angular/common";

@Component({
  selector: "sp-three-col",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./three-col.component.html",
  styleUrls: ["./three-col.component.scss"],
})
export class ThreeColComponent {
  @Input()
  singleColumn = false;
}
