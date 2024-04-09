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
        res={
          "result": [
            {
              "actionMessages": {},
              "success": true,
              "ruleGroup": "VALIDATION_ACTION",
              "ruleName": "Engineering Requirement1 Start Date Invalid ",
              "message": "Engineering Requirement1 Start Date Invalid  rule executed successfully."
            },
            {
              "actionMessages": {},
              "success": true,
              "ruleGroup": "VALIDATION_ACTION",
              "ruleName": "Engineering Requirement2 Start Date Invalid ",
              "message": "Engineering Requirement2 Start Date Invalid  rule executed successfully."
            },
            {
              "actionMessages": {},
              "success": true,
              "ruleGroup": "VALIDATION_ACTION",
              "ruleName": "Engineering Requirement3 Start Date Invalid ",
              "message": "Engineering Requirement3 Start Date Invalid  rule executed successfully."
            },
            {
              "actionMessages": {
                "IS_NOT_VALID": "Action IS_NOT_VALID failed."
              },
              "success": false,
              "ruleGroup": "VALIDATION_ACTION",
              "ruleName": "Manufacturing Requirement1 Start Date Invalid ",
              "message": "Manufacturing Requirement1 Start Date Invalid  - IF manufacturing_requirements_1_start_date GREATER THAN manufacturing_requirements_1_end_date THEN\nmanufacturing_requirements_1_start_date IS NOT VALID"
            },
            {
              "actionMessages": {},
              "success": true,
              "ruleGroup": "VALIDATION_ACTION",
              "ruleName": "Manufacturing Requirement2 Start Date Invalid ",
              "message": "Manufacturing Requirement2 Start Date Invalid  rule executed successfully."
            },
            {
              "actionMessages": {},
              "success": true,
              "ruleGroup": "VALIDATION_ACTION",
              "ruleName": "Validation Requirement Start Date Invalid ",
              "message": "Validation Requirement Start Date Invalid  rule executed successfully."
            },
            {
              "actionMessages": {},
              "success": true,
              "ruleGroup": "VALIDATION_ACTION",
              "ruleName": "Purchasing Requirement Start Date Invalid ",
              "message": "Purchasing Requirement Start Date Invalid  rule executed successfully."
            },
            {
              "actionMessages": {},
              "success": true,
              "ruleGroup": "VALIDATION_ACTION",
              "ruleName": "Engineering Requirements1 & 2 cannot be Same",
              "message": "Engineering Requirements1 & 2 cannot be Same rule executed successfully."
            },
            {
              "actionMessages": {},
              "success": true,
              "ruleGroup": "VALIDATION_ACTION",
              "ruleName": "Engineering Requirements 3&2&1 Cannot be Same ",
              "message": "Engineering Requirements 3&2&1 Cannot be Same  rule executed successfully."
            },
            {
              "actionMessages": {},
              "success": true,
              "ruleGroup": "VALIDATION_ACTION",
              "ruleName": "Manufacturing Requirements 1&2 cannot be Same",
              "message": "Manufacturing Requirements 1&2 cannot be Same rule executed successfully."
            },
            {
              "actionMessages": {},
              "success": true,
              "ruleGroup": "VALIDATION_ACTION",
              "ruleName": "Reman NUD Description is Required ",
              "message": "Reman NUD Description is Required  rule executed successfully."
            },
            {
              "actionMessages": {},
              "success": true,
              "ruleGroup": "VALIDATION_ACTION",
              "ruleName": "Reman NUD Status is Required ",
              "message": "Reman NUD Status is Required  rule executed successfully."
            },
            {
              "actionMessages": {},
              "success": true,
              "ruleGroup": "VALIDATION_ACTION",
              "ruleName": "Plan Review Date is Required ",
              "message": "Plan Review Date is Required  rule executed successfully."
            },
            {
              "actionMessages": {},
              "success": true,
              "ruleGroup": "VALIDATION_ACTION",
              "ruleName": "Plan Reviewer is Required ",
              "message": "Plan Reviewer is Required  rule executed successfully."
            },
            {
              "actionMessages": {},
              "success": true,
              "ruleGroup": "VALIDATION_ACTION",
              "ruleName": "Plan Approval Date is Required ",
              "message": "Plan Approval Date is Required  rule executed successfully."
            },
            {
              "actionMessages": {},
              "success": true,
              "ruleGroup": "VALIDATION_ACTION",
              "ruleName": "Plan Approver is Required ",
              "message": "Plan Approver is Required  rule executed successfully."
            },
            {
              "actionMessages": {},
              "success": true,
              "ruleGroup": "VALIDATION_ACTION",
              "ruleName": "Plan Reviewer and Date Required ",
              "message": "Plan Reviewer and Date Required  rule executed successfully."
            },
            {
              "actionMessages": {},
              "success": true,
              "ruleGroup": "VALIDATION_ACTION",
              "ruleName": "Plan Set is Yes ",
              "message": "Plan Set is Yes  rule executed successfully."
            }
          ],
          "updatedBy": "shilpa.sonawane@simadvisorypartner.com",
          "dataId": 17172,
          "groupId": 0,
          "entityId": 288,
          "updatedDate": 1712242611.835206,
          "id": 9
        }
        this.rows = res.result.filter((element: any) => {
          return element.success == false;
        });
      });
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
}
