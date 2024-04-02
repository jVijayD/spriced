import { Component, Input } from "@angular/core";
import { CommonModule } from "@angular/common";
import { AngularSplitModule, SplitComponent } from "angular-split";

@Component({
  selector: "sp-two-col-three-forth-expandable",
  standalone: true,
  imports: [CommonModule, AngularSplitModule],
  templateUrl: "./two-col-three-forth-expandable.component.html",
  styleUrls: ["./two-col-three-forth-expandable.component.scss"],
  providers: [SplitComponent],
})
export class TwoColThreeForthExpandableComponent {
  @Input()
  singleColumn = false;
  onDrag(event: any) {
    window.dispatchEvent(new Event("resize"));
  }
}
