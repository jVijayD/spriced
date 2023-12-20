import { Component, Inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { AppForm, DynamicFormModule, DynamicFormService, FORM_DATA_SERVICE, FormFieldControls, SnackBarService } from "@spriced-frontend/spriced-ui-lib";
import { Validators } from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { FilterListService } from "../services/filter-list.service";

@Component({
  selector: "sp-add-filterlist",
  standalone: true,
  imports: [CommonModule, DynamicFormModule, MatIconModule, MatButtonModule],
  providers: [
    DynamicFormService,
    { provide: FORM_DATA_SERVICE, useValue: null },
  ],
  templateUrl: "./add-filterlist.component.html",
  styleUrls: ["./add-filterlist.component.scss"],
})
export class AddFilterlistComponent {
  formData = {};
  appForm!: AppForm;
  constructor(public dialogRef: MatDialogRef<AddFilterlistComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private filterListService: FilterListService,
    private snackbarService: SnackBarService) {
    this.appForm = {
      title: data.action + " filter",
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
      value: this.data?.item.name,
      placeholder: "Name",
      label: "Name",
      maxLength:50,
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
          name: "minlength",
          message: "Name must be at least 3 characters long.",
          validator: Validators.minLength(3),
        },
        {
          name: "maxlength",
          message: "Name can have a maximum 50 characters",
          validator: Validators.maxLength(50),
        },
      ],
    },
    {
      type: "input",
      subType: "text",
      name: "description",
      maxLength:250,
      value: this.data?.item.description,
      placeholder: "Description",
      label: "Description",
      validations: [{
        name: "maxlength",
        message: "Description can have a maximum 250 characters",
        validator: Validators.maxLength(250),
      },]
    },
  ];
  onClose(data: any) {
    this.dialogRef.close(data);
  }
  onReset(data: any) {
    this.dialogRef.close(data);
  }
  onSubmit(data: any) {
    this.data.item.name = data.value.name
    this.data.item.description = data.value.description
    if (this.data.action == 'Add') {
      this.filterListService.addFilters(this.data.item).subscribe({
        next: (result) => {
          this.snackbarService.success("Filter saved successfully.");
        },
        error: (err) => {

          if (err.error.errorCode == "DB_UK-008") {
            this.snackbarService.error("Filter with same name already exists");
          }
          else {
            this.snackbarService.error("Save failed.");
          }
        },
      });
    }
    else {
      this.filterListService.editFilter(this.data.item).subscribe({
        next: (result) => {
          this.snackbarService.success("Filter updated successfully.");
        },
        error: (err) => {

          if (err.error.errorCode == "DB_UK-008") {
            this.snackbarService.error("Filter with same name already exists");
          }
          else {
            this.snackbarService.error("Edit failed.");
          }
        },
      });
    }
    this.dialogRef.close(data);
  }
}