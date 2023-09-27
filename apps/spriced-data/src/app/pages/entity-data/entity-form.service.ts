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
  public getFormFieldControls(
    entity: Entity,
    codeSettings: string
  ): FormFieldControls {
    return entity.attributes
      .filter((item) => {
        return (
          (item.permission !== "DENY" && item.editable === true) ||
          item.constraintType == "PRIMARY_KEY"
        );
      })
      .map((attr: Attribute) => {
        return this.getType(attr, codeSettings);
      });
  }

  public extractFormFieldsOnly(selectedItem: any, value: any) {
    let extractedFields: any = {};

    Object.keys(value).forEach((key) => {
      if (selectedItem.hasOwnProperty(key)) {
        extractedFields[key] = selectedItem[key];
      }
    });
    return extractedFields;
  }

  public extractExtraData(selectedItem: any, selectedEntity: Entity) {
    let extraData: Map<string, object> = new Map<string, object>();
    selectedEntity.attributes
      .filter((item) => item.type == "LOOKUP" && item.permission == "UPDATE")
      .forEach((attribute) => {
        const attribute_name = `${attribute.name}_name`;
        const attribute_code = `${attribute.name}_code`;
        if (
          selectedItem.hasOwnProperty(attribute_name) &&
          selectedItem.hasOwnProperty(attribute_code)
        ) {
          extraData.set(attribute_name, selectedItem[attribute_name]);
          extraData.set(attribute_code, selectedItem[attribute_code]);
        }
      });
    return extraData;
  }

  private getType(attr: Attribute, codeSettings: string): GenericControl {
    if (attr.type === "LOOKUP") {
      return {
        type: "lookup-select",
        name: attr.name,
        label: attr.displayName || attr.name,
        readOnly: attr.permission === "READ" ? true : false,
        displayProp:
          codeSettings === "code"
            ? "code"
            : codeSettings === "codename"
            ? "code|name"
            : "name|code",
        valueProp: "id",
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
            params: [attr.referencedTableId,0],
            provider: FORM_DATA_SERVICE,
          },
        },
        validations: [
          // {
          //   name: "required",
          //   message: `${
          //     attr.displayName || attr.name
          //   } is required.`.toLowerCase(),
          //   validator: Validators.required,
          // },
        ],
      };
    } else {
      // //debugger;
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
            readOnly: attr.permission === "READ" ? true : false,
          };
        case "INTEGER":
        case "DECIMAL":
          //debugger;
          return {
            type: "numeric",
            subType: "text",
            name: attr.name,
            placeholder: attr.displayName || attr.name,
            label: attr.displayName || attr.name,
            decimalCount: attr.size,
            validations: this.getValidations(attr),
            readOnly: attr.permission === "READ" ? true : false,
          };

        case "TIME_STAMP":
          //debugger;
          return {
            name: attr.name,
            type: "date",
            format: attr.formatter || "MM/DD/yyyy",
            label: attr.displayName || attr.name,
            placeholder: attr.displayName || attr.name,
            startDate: moment(new Date()).format("YYYY-MM-DD"),
            startView: "month",
            hiddenDefault: null,
            validations: this.getValidations(attr),
            readOnly: attr.permission === "READ" ? true : false,
          };
        case "BOOLEAN":
          return {
            type: "checkbox",
            name: attr.name,
            label: attr.displayName || attr.name,
            validations: this.getValidations(attr),
            readOnly: attr.permission === "READ" ? true : false,
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

  // public getDateFormatter(mask: string) {
  //   switch (mask) {
  //     case "MM/dd/yy":
  //       return "MM/DD/YY";
  //     case "MM/dd/yyyy":
  //       return "MM/DD/YYYY";
  //     case "dd/MM/yy":
  //       return "DD/MM/YY";
  //     case "dd/MM/yyyy":
  //       return "DD/MM/YYYY";
  //     case "yy/MM/dd":
  //       return "YY/MM/DD";
  //     case "yyyy/MM/dd":
  //       return "YYYY/MM/DD";
  //     case "dd-MM-yy":
  //       return "DD-MM-YY";
  //     case "dd-MM-yyyy":
  //       return "DD-MM/YYYY";
  //     case "yy-MM-dd":
  //       return "YY-MM-DD";
  //     case "yyyy-MM-dd":
  //       return "YYYY-MM-DD";
  //     case "MM/yyyy":
  //       return "MM/YYYY";
  //     default:
  //       return "MM/DD/YYYY";
  //   }
  // }
}
