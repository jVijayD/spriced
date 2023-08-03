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

@Component({
  selector: "sp-add-model",
  standalone: true,
  imports: [CommonModule, MatDialogModule, DynamicFormModule],
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
  onDismiss(): void {
    this.dialogRef.close(false);
  }
  onConfirm(): void {
    this.dialogRef.close(true);
  }
}
