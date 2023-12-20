import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { HeaderActionComponent } from "@spriced-frontend/spriced-ui-lib";
import { DownloadsProgressComponent } from "../downloads-progress.component";
import { MatDialogRef } from "@angular/material/dialog";
import { MatProgressBarModule } from "@angular/material/progress-bar";
import { MatIconModule } from "@angular/material/icon";

@Component({
  selector: "sp-downloads-dialogue",
  standalone: true,
  imports: [CommonModule, HeaderActionComponent, MatProgressBarModule,MatIconModule],
  templateUrl: "./downloads-dialogue.component.html",
  styleUrls: ["./downloads-dialogue.component.scss"],
})
export class DownloadsDialogueComponent {
  data=[
    {
      entity:"entit1",
      value:40
    },
    {
      entity:"entit1",
      value:80
    },
    {
      entity:"entit2",
      value:100
    },
    {
      entity:"entit3",
      value:90
    },
    {
      entity:"entit4",
      value:20
    },
    {
      entity:"entit5",
      value:30
    },
  ]
  constructor(public dialogRef: MatDialogRef<DownloadsDialogueComponent>) {}
  onNoClick(): void {
    this.dialogRef.close();
  }
}
