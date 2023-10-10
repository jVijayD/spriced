import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MatDialogModule, MatDialogRef } from "@angular/material/dialog";
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";

@Component({
  selector: "sp-upload-dialoge",
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatIconModule, MatButtonModule,MatFormFieldModule,MatInputModule],
  templateUrl: "./upload-dialoge.component.html",
  styleUrls: ["./upload-dialoge.component.scss"],
})
export class UploadDialogeComponent {
  file!: any;
  isDisabled=true
  errorMsg =false
  constructor(public dialogRef: MatDialogRef<UploadDialogeComponent>) {}
  uploadFile(e: any) {
    this.file = e.target.files[0];
    if(this.file==undefined)
    {
      this.isDisabled=true
    }
    else
    {
      if (!this.validateFile(this.file.name)) {
        this.isDisabled=true
        this.errorMsg=true
    }
    else{
      this.isDisabled=false
      this.errorMsg=false

    }
    }

  }
  validateFile(name: String) {
    var ext = name.substring(name.lastIndexOf('.') + 1);
    if (ext.toLowerCase() == 'csv' ||ext.toLowerCase() == 'xlsx' || ext.toLowerCase() == 'xls') {
        return true;
    }
    else {
        return false;
    }
}
  doAction() {
    this.dialogRef.close({ data: this.file });
  }
  closeDialog() {
    this.dialogRef.close();
  }
}
