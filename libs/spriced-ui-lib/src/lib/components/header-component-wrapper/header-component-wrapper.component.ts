import { Component, Input } from "@angular/core";
import { CommonModule } from "@angular/common";

@Component({
  selector: "sp-header-component-wrapper",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./header-component-wrapper.component.html",
  styleUrls: ["./header-component-wrapper.component.scss"],
})
export class HeaderComponentWrapperComponent {
  @Input()
  title!: String;
}
