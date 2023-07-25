import { ChangeDetectionStrategy, Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MatDialogRef } from "@angular/material/dialog";
import {
  AppForm,
  DynamicFormModule,
  DynamicFormService,
  FORM_DATA_SERVICE,
  FormFieldControls,
  SnackBarService,
} from "@spriced-frontend/spriced-ui-lib";
import { FormGroup, Validators } from "@angular/forms";
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";
import { ModelService } from "apps/spriced-data-definition/src/app/services/model.service";

@Component({
  selector: "sp-entity-add",
  standalone: true,
  imports: [CommonModule, DynamicFormModule, MatIconModule, MatButtonModule],
  providers: [
    DynamicFormService,
    { provide: FORM_DATA_SERVICE, useValue: null },
    ModelService,
  ],
  templateUrl: "./model-add.component.html",
  styleUrls: ["./model-add.component.scss"],
  //changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ModelAddComponent {
  formData = {};
  private formFields: FormFieldControls = [
    {
      type: "input",
      subType: "text",
      name: "name",
      placeholder: "Name",
      icon: "phone",
      label: "Name",
      validations: [
        {
          name: "required",
          message: "Name is required.",
          validator: Validators.required,
        },
        {
          name: "minlength",
          message: "Min length should be 5.",
          validator: Validators.minLength(5),
        },
      ],
    },
    {
      type: "input",
      subType: "text",
      name: "displayName",
      placeholder: "DisplayName",
      icon: "phone",
      label: "DisplayName",
      validations: [
        {
          name: "required",
          message: "DisplayName is required.",
          validator: Validators.required,
        },
        {
          name: "minlength",
          message: "Min length should be 5.",
          validator: Validators.minLength(5),
        },
      ],
    },
  ];

  appForm!: AppForm;
  constructor(
    public dialogRef: MatDialogRef<ModelAddComponent>,
    private modelService: ModelService,
    private snackbarService: SnackBarService
  ) {
    this.dialogRef.disableClose = true;
    this.appForm = {
      title: "Add/Edit Model",
      //columns: 4,
      groups: [
        {
          title: "",
          formFieldControls: [...this.formFields],
        },
      ],
      asyncValidations: [],
      validations: [],
    };
  }

  onClose() {
    this.dialogRef.close();
  }

  onSubmit(data: FormGroup<any>) {
    if (data.valid) {
      this.modelService.add(data.value).subscribe((results: any) => {
        this.snackbarService.success("Succesfully created");
      });
      this.onClose();
    }
  }
}
