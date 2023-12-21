import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MatIconModule } from "@angular/material/icon";
import { MatDialog } from "@angular/material/dialog";
import { DownloadsDialogueComponent } from "./downloads-dialogue/downloads-dialogue.component";

@Component({
  selector: "sp-downloads-progress",
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: "./downloads-progress.component.html",
  styleUrls: ["./downloads-progress.component.scss"],
})
export class DownloadsProgressComponent {
  constructor(public dialog: MatDialog) {}
  onDownloads() {
    this.dialog.open(DownloadsDialogueComponent, {});
  }
}
