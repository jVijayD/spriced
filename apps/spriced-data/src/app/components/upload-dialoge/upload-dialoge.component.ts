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
  file!: any;
  constructor(public dialogRef: MatDialogRef<UploadDialogeComponent>) {}
  uploadFile(e: any) {
    // let files: FileList = e.target.files;
    // this.file = files[0];
    this.file = e.target.files[0];
  }
  doAction() {
    this.dialogRef.close({ data: this.file });
  }
  closeDialog() {
    this.dialogRef.close();
  }
}
