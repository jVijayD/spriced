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
  DialogService
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
    private dialogService:DialogService,
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
      // icon: "schema",
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
          validator: Validators.pattern('^(?=[a-zA-Z0-9])[a-zA-Z0-9_#-]+$'),
        },
        {
          name: "minlength",
          message: "Min length must be greater than 3.",
          validator: Validators.minLength(3),
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
      placeholder: "Display Name",
      // icon: "schema",
      label: "Display Name",
      validations: [
        {
          name: "required",
          message: "Display Name is required.",
          validator: Validators.required,
        },
        {
          name: "pattern",
          message: "Invalid Display Name",
          validator: Validators.pattern('^(?=[a-zA-Z0-9])[a-zA-Z0-9 _#-]+$'),
        },
        {
          name: "minlength",
          message: "Min length must be greater than 3.",
          validator: Validators.minLength(3),
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
      name: "description",
      value: this.data.value?.description || "",
      placeholder: "Description",
      label: "Description",
      maxLength:100
    },

  ];

  appForm!: AppForm;

  onClose(data: any) {
    this.dialogRef.close(data);
  }
  onReset(event: any) {
      if(this.data.action == 'Add'){
      if(event.displayName){
        this.showSaveDialog();
      }else{
        this.dialogRef.close({event:"Cancel"});
       }
  }
  else if(this.data.action == 'Edit'){
    if(this.data.value.displayName !== event.displayName){
      this.showSaveDialog();
    }else{
      this.dialogRef.close({event:"Cancel"});
    }
  }    
  }
  showSaveDialog(){
    const dialogResult = this.dialogService.openConfirmDialoge({
      title: "Confirm",
      icon: "public",
      message:
      "All the unsaved changes will be lost. Do you want to save the changes ?",
      maxWidth: 400,
    });
    dialogResult.afterClosed().subscribe((val) => {
      if (val) {
              
      }else{
        this.dialogRef.close({event:"Cancel"});
      }
    });
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
              this.snackbarService.error("Model Already Exists");
            } else {
              this.snackbarService.error("Model Creation Failed.");
            }
          },
        });
      } else if (this.data.action == "Edit") {
        console.log(data.value)
        this.modelService.edit(data.value, this.data.value).subscribe({
          next: (results: any) => {
            this.snackbarService.success("Model Successfully Updated.");
            this.onClose({ data: results, action: this.data.action });
          },
          error: (err: any) => {
            if (err.error.errorCode == "DB_UK-008") {
              this.snackbarService.error("Model Already Exists.");
            }
            else{
            this.snackbarService.error("Update Model  Failed.");
            }
          },
        });
      }
    }
  }
}
