import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { HeaderActionComponent } from "@spriced-frontend/spriced-ui-lib";
import { DownloadsProgressComponent } from "../downloads-progress.component";
import { MatDialogRef } from "@angular/material/dialog";
import { MatProgressBarModule } from "@angular/material/progress-bar";
import { MatIconModule } from "@angular/material/icon";
import { DownloadsProgressService } from "../services/downloads-progress.service";

@Component({
  selector: "sp-downloads-dialogue",
  standalone: true,
  imports: [
    CommonModule,
    HeaderActionComponent,
    MatProgressBarModule,
    MatIconModule,
  ],
  templateUrl: "./downloads-dialogue.component.html",
  styleUrls: ["./downloads-dialogue.component.scss"],
})
export class DownloadsDialogueComponent {
  data;
  constructor(
    public dialogRef: MatDialogRef<DownloadsDialogueComponent>,
    public progressService: DownloadsProgressService
  ) {
    this.progressService.setProgress()
    this.data = this.progressService.getProgress();
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
}
