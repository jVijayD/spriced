import { Injectable } from "@angular/core";
import { Validators } from "@angular/forms";
import { Attribute, Entity } from "@spriced-frontend/spriced-common-lib";
import {
  FORM_DATA_SERVICE,
  FormFieldControls,
  GenericControl,
  IValidator,
} from "@spriced-frontend/spriced-ui-lib";
import * as moment from "moment";

@Injectable()
export class EntityFormService {
  public getFormFieldControls(entity: Entity): FormFieldControls {
    return entity.attributes
      .filter((item) => {
        return (
          (item.permission !== "DENY" && item.editable === true) ||
          item.constraintType == "PRIMARY_KEY"
        );
      })
      .map((attr: Attribute) => {
        return this.getType(attr);
      });
  }

  private getType(attr: Attribute): GenericControl {
    if (attr.type === "LOOKUP") {
      return {
        type: "lookup-select",
        name: attr.name,
        label: attr.displayName || attr.name,
        readOnly: attr.permission === "VIEW" ? true : false,
        displayProp: "name",
        valueProp: "code",
        eventValue: attr.referencedTableId,
        eventType: "lookup",
        placeholder: {
          value: "",
          displayText: "--Select--",
        },
        data: {
          api: {
            onLoad: true,
            isFixed: true,
            method: "loadLookupData",
            params: [attr.referencedTableId],
            provider: FORM_DATA_SERVICE,
          },
        },
        validations: [
          {
            name: "required",
            message: `${
              attr.displayName || attr.name
            } is required.`.toLowerCase(),
            validator: Validators.required,
          },
        ],
      };
    } else {
      switch (attr.dataType) {
        case "STRING_VAR":
        case "TEXT":
        case "LINK":
          return {
            type: "input",
            subType: "text",
            name: attr.name,
            placeholder: attr.displayName || attr.name,
            label: attr.displayName || attr.name,
            validations: this.getValidations(attr),
            readOnly: attr.permission === "VIEW" ? true : false,
          };
        case "INTEGER":
        case "DECIMAL":
          return {
            type: "numeric",
            subType: "text",
            name: attr.name,
            placeholder: attr.displayName || attr.name,
            label: attr.displayName || attr.name,
            decimalCount: attr.numberOfDecimalValues,
            validations: this.getValidations(attr),
            readOnly: attr.permission === "VIEW" ? true : false,
          };

        case "TIME_STAMP":
          return {
            name: attr.name,
            type: "date",
            format: attr.formatter ?? "MM/DD/YYYY",
            label: "MM/DD/YYYY",
            placeholder: attr.displayName || attr.name,
            startDate: moment(new Date()).format("YYYY-MM-DD"),
            startView: "month",
            hiddenDefault: null,
            validations: this.getValidations(attr),
            readOnly: attr.permission === "VIEW" ? true : false,
          };
        case "BOOLEAN":
          return {
            type: "checkbox",
            name: attr.name,
            label: attr.displayName || attr.name,
            validations: this.getValidations(attr),
            readOnly: attr.permission === "VIEW" ? true : false,
            value: false,
          };
        case "AUTO":
        default:
          return {
            type: "input",
            subType: "hidden",
            name: attr.name,
            label: "",
          };
      }
    }
  }

  private getValidations(attr: Attribute): IValidator[] {
    let validations: IValidator[] = [];

    if (!attr.nullable) {
      validations.push({
        name: `required`,
        message: `${attr.displayName || attr.name} is required.`.toLowerCase(),
        validator: Validators.required,
      });
    }

    if (
      attr.size &&
      (attr.dataType === "LINK" ||
        attr.dataType === "STRING_VAR" ||
        attr.dataType === "TEXT")
    ) {
      validations.push({
        name: `maxlength`,
        message: `Maximum length is ${attr.size}.`.toLowerCase(),
        validator: Validators.maxLength,
      });
    }

    if (attr.dataType === "LINK") {
      validations.push({
        name: `${attr.name}_pattern`,
        message: `Invalid pattern for link`.toLowerCase(),
        validator: Validators.pattern(
          "(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?"
        ),
      });
    }
    return validations;
  }
}
