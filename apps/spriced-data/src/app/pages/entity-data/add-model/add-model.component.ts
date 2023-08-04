import { Component, Inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from "@angular/material/dialog";
import {
  AppForm,
  DynamicFormModule,
  DynamicFormService,
  FORM_DATA_SERVICE,
} from "@spriced-frontend/spriced-ui-lib";
import { MatIconModule } from "@angular/material/icon";
import { FormGroup } from "@angular/forms";

@Component({
  selector: "sp-add-model",
  standalone: true,
  imports: [CommonModule, MatDialogModule, DynamicFormModule, MatIconModule],
  providers: [
    {
      provide: FORM_DATA_SERVICE,
      useValue: {
        //   getMembers: () => {
        //     return of([10, 20, 30, 40, 50]);
        //   },
        //   getCountries: () => {
        //     return of([
        //       {
        //         name: "England",
        //         id: 4,
        //         countryCode: "+95",
        //       },
        //     ]);
        //   },
      },
    },
    DynamicFormService,
  ],
  templateUrl: "./add-model.component.html",
  styleUrls: ["./add-model.component.scss"],
})
export class AddModelComponent {
  constructor(
    public dialogRef: MatDialogRef<AddModelComponent>,
    @Inject(MAT_DIALOG_DATA) public dialogData: any
  ) {
    dialogRef.disableClose = true;
  }
  onClose(): void {
    this.dialogRef.close(null);
  }

  onSubmit(data: FormGroup<any>) {
    if (data.valid) {
      this.dialogRef.close(data.value);
    }
  }
  // onConfirm(): void {
  //   this.dialogRef.close(true);
  // }
}
