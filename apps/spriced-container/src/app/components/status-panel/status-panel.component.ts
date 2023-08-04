import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MatIconModule } from "@angular/material/icon";

@Component({
  selector: "sp-status-panel",
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: "./status-panel.component.html",
  styleUrls: ["./status-panel.component.scss"],
})
export class StatusPanelComponent {
  onSuccesClick() {
    alert("SUCCESS");
  }
  onErrorClick() {}
  onInfoClick() {}
}
