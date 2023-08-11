import { Component, Inject, OnInit } from "@angular/core";
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
import { Entity } from "@spriced-frontend/spriced-common-lib";

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
export class AddModelComponent implements OnInit {
  appForm!: AppForm;
  entity!: Entity;
  selectedItem!: any;

  constructor(
    public dialogRef: MatDialogRef<AddModelComponent>,
    @Inject(MAT_DIALOG_DATA) public dialogData: any,
    private dynamicFormService: DynamicFormService
  ) {
    dialogRef.disableClose = true;
    this.appForm = dialogData.appForm;
    this.entity = dialogData.entity;
    this.selectedItem = dialogData.selectedItem;
  }
  ngOnInit(): void {
    if (this.selectedItem) {
      this.dynamicFormService.parentForm?.setValue(this.selectedItem);
    }
  }

  onClose(): void {
    this.dialogRef.close(null);
  }

  onSubmit(data: FormGroup<any>) {
    if (data.valid) {
      
    }
  }

  onClear(submittedData: any) {
    this.dynamicFormService.parentForm?.setValue(submittedData);
  }
}
