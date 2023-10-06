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
  isDisabled=true
  constructor(public dialogRef: MatDialogRef<UploadDialogeComponent>) {}
  uploadFile(e: any) {
    this.file = e.target.files[0];
    console.log(this.file)
    if(this.file==undefined)
    {
      this.isDisabled=true
    }
    else
    {
      this.isDisabled=false
    }

  }
  doAction() {
    this.dialogRef.close({ data: this.file });
  }
  closeDialog() {
    this.dialogRef.close();
  }
}
