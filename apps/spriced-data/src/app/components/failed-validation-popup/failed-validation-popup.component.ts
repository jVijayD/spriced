import { Component, Inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { HeaderActionComponent } from "@spriced-frontend/spriced-ui-lib";
import { MatTableModule } from "@angular/material/table";
import { ValidationService } from "./service/validation.service";

@Component({
  selector: "sp-failed-validation-popup",
  standalone: true,
  imports: [CommonModule, HeaderActionComponent, MatTableModule],
  templateUrl: "./failed-validation-popup.component.html",
  styleUrls: ["./failed-validation-popup.component.scss"],
})
export class FailedValidationPopupComponent {
  displayedColumns = ["ruleName", "message"];
  rows: any = [];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<FailedValidationPopupComponent>,
    private validationService: ValidationService
  ) {
    this.validationService
      .getFailedValidation(data.entityId, data.rowId)
      .subscribe((res: any) => {
        this.rows = res.result.filter((element: any) => {
          return element.success == false;
        });
      });
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
}
