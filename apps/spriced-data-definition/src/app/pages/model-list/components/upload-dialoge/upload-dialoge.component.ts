import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MatDialogModule, MatDialogRef } from "@angular/material/dialog";
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";

@Component({
  selector: "sp-upload-dialoge",
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatIconModule, MatButtonModule],
  templateUrl: "./upload-dialoge.component.html",
  styleUrls: ["./upload-dialoge.component.scss"],
})
export class UploadDialogeComponent {
  file: any;
  constructor(public dialogRef: MatDialogRef<UploadDialogeComponent>) {}
  uploadFile(e: any) {
    console.log(e.target)
    this.file = e.target.files;
  }
  doAction() {
    this.dialogRef.close({ data: this.file ,action:'upload'});
  }
  closeDialog() {
    this.dialogRef.close();
  }
}
