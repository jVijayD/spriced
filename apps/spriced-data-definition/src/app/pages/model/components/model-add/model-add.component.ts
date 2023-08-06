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
    this.dialogRef.disableClose = true;
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
      icon: "business",
      label: "Name",
      readOnly: this.data.action == "Edit" ? true : false,
      validations: [
        {
          name: "required",
          message: "Name is required.",
          validator: Validators.required,
        },
        // {
        //   name: "minlength",
        //   message: "Min length should be 5.",
        //   validator: Validators.minLength(5),
        // },
      ],
    },
    {
      type: "input",
      subType: "text",
      name: "displayName",
      value: this.data.value?.displayName || "",
      placeholder: "DisplayName",
      icon: "business",
      label: "DisplayName",
      validations: [
        {
          name: "required",
          message: "DisplayName is required.",
          validator: Validators.required,
        },
        // {
        //   name: "minlength",
        //   message: "Min length should be 5.",
        //   validator: Validators.minLength(5),
        // },
      ],
    },
  ];

  appForm!: AppForm;

  onClose(data: any) {
    this.dialogRef.close(data);
  }

  onSubmit(data: FormGroup<any>) {
    if (data.valid) {
      if (this.data.action == "Add") {
        this.modelService.add(data.value).subscribe((results: any) => {
          this.snackbarService.success("Model Successfully Created.");
          //this.dataChange.emit(results);
          this.onClose({ data: results, action: this.data.action });
        });
      } else if (this.data.action == "Edit") {
        this.modelService
          .edit(data.value, this.data.value)
          .subscribe((results: any) => {
            this.snackbarService.success("Model Successfully Updated.");
            this.onClose({ data: results, action: this.data.action });
          });
      }
    }
  }
}
