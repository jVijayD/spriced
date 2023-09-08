import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Inject,
  Optional,
  Output,
} from "@angular/core";
import { CommonModule } from "@angular/common";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
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
import { error } from "console";

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
  @Output() dataChange = new EventEmitter<any>();

  constructor(
    public dialogRef: MatDialogRef<ModelAddComponent>,
    private modelService: ModelService,
    private snackbarService: SnackBarService,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.dialogRef.disableClose = false;
  
    this.appForm = {
      title: this.data.action === "Edit" ? "Edit Model" : "Add Model",
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
  private formFields: FormFieldControls = [
    {
      type: "input",
      subType: "text",
      name: "name",
      value: this.data.value?.name || "",
      placeholder: "Name",
      icon: "schema",
      label: "Name",
      readOnly: this.data.action == "Edit" ? true : false,
      validations: [
        {
          name: "required",
          message: "Name is required.",
          validator: Validators.required,
        },
        {
          name: "pattern",
          message: "Invalid Name",
          validator: Validators.pattern('^(?=[a-zA-Z0-9])[a-zA-Z0-9 _#-]+$'),
        },
        {
          name: "maxlength",
          message: "Max length should be 100.",
          validator: Validators.maxLength(100),
        },
      ],
    },
    {
      type: "input",
      subType: "text",
      name: "displayName",
      value: this.data.value?.displayName || "",
      placeholder: "DisplayName",
      icon: "schema",
      label: "DisplayName",
      validations: [
        {
          name: "required",
          message: "DisplayName is required.",
          validator: Validators.required,
        },
        {
          name: "pattern",
          message: "Invalid Display Name",
          validator: Validators.pattern('^(?=[a-zA-Z0-9])[a-zA-Z0-9 _#-]+$'),
        },
        {
          name: "maxlength",
          message: "Max length should be 100.",
          validator: Validators.maxLength(100),
        },
      ],
    },
  ];

  appForm!: AppForm;

  onClose(data: any) {
    this.dialogRef.close(data);
  }
  onReset(event: any) {
    this.dialogRef.close(null);
  }
  onSubmit(data: FormGroup<any>) {
    if (data.valid) {
      if (this.data.action == "Add") {
        this.modelService.add(data.value).subscribe({
          next: (results: any) => {
            this.snackbarService.success("Model Successfully Created.");
            //this.dataChange.emit(results);
            this.onClose({ data: results, action: this.data.action });
          },
          error: (err: any) => {
            if (err.error.errorCode == "DB_UK-008") {
              this.snackbarService.error("Model Already Exists.");
            } else {
              this.snackbarService.error("Model Creation Failed.");
            }
          },
        });
      } else if (this.data.action == "Edit") {
        this.modelService.edit(data.value, this.data.value).subscribe({
          next: (results: any) => {
            this.snackbarService.success("Model Successfully Updated.");
            this.onClose({ data: results, action: this.data.action });
          },
          error: (err: any) => {
            this.snackbarService.error("Update Model  Failed.");
          },
        });
      }
    }
  }
}
