import { Component, Inject, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from "@angular/material/dialog";
import {
  AppForm,
  DialogueModule,
  DynamicFormModule,
  DynamicFormService,
  FORM_DATA_SERVICE,
  SnackBarService,
} from "@spriced-frontend/spriced-ui-lib";
import { MatIconModule } from "@angular/material/icon";
import { FormGroup } from "@angular/forms";
import { Entity } from "@spriced-frontend/spriced-common-lib";
import { EntityDataService } from "../../../services/entity-data.service";

@Component({
  selector: "sp-add-model",
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    DynamicFormModule,
    MatIconModule,
    DialogueModule,
  ],
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
    SnackBarService,
    EntityDataService,
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
    private dynamicFormService: DynamicFormService,
    private snackbarService: SnackBarService,
    private entityDataService: EntityDataService
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
    //debugger;
    if (data.valid) {
      const entityId = this.selectedItem.id as number;
      //const finalData = this.removeNull(data.value);
      const finalData = data.value;
      if (!this.selectedItem) {
        this.createEntityData(entityId, finalData);
      } else {
        this.editEntityData(entityId, this.selectedItem.id, finalData);
      }
    } else {
      this.snackbarService.warn("Invalid record data.");
    }
  }

  private createEntityData(entityId: number, data: any) {
    this.entityDataService.createEntityData(entityId, data).subscribe({
      next: (item) => {
        this.dynamicFormService.parentForm?.reset();
        this.snackbarService.success("Record created successfully.");
        // this.loadEntityData(
        //   this.currentSelectedEntity as Entity,
        //   this.currentCriteria
        // );
        this.dialogRef.close(true);
      },
      error: (err) => {
        console.error(err);
        let errMessage = "";
        if (err.error.errorCode === "DB_UK-008") {
          errMessage = `Unique constraint violation-${err.error.details}`;
        }
        this.snackbarService.error(`Record creation failed.${errMessage}`);
      },
    });
  }

  private editEntityData(entityId: number, recordId: number, data: any) {
    data.id = recordId;
    this.entityDataService.updateEntityData(entityId, data).subscribe({
      next: (item) => {
        //this.onClear();
        this.snackbarService.success("Record updated successfully.");
        // this.loadEntityData(
        //   this.currentSelectedEntity as Entity,
        //   this.currentCriteria
        // );
        this.dialogRef.close(true);
      },
      error: (err) => {
        console.error(err);
        this.snackbarService.error("Record update failed.");
      },
    });
  }

  onClear(submittedData: any) {
    //debugger;
    this.dynamicFormService.parentForm?.setValue(submittedData);
  }
}
