import { Injectable } from "@angular/core";
import { Attribute, Entity } from "../../index";
import { Header, QueryColumns } from "./dynamic-form.types";
import * as moment from "moment";

@Injectable({
  providedIn: 'root'
})
export class GridEntityService {
  public getFilterColumns(headers: Header[]): QueryColumns[] {
    return headers
      .filter((item) => item.isFilterable)
      .map((col: any) => {
        return {
          name: col.column,
          displayName: col.name,
          dataType: col.dataType || "string",
          options: col.dataType === "category" ? col.options : undefined,
        };
      });
  }

  public getGridHeaders(
    entity: Entity,
    showSystemAttributes: boolean,
    lookupSettings: string
  ): Header[] {
    return entity.attributes
      .filter((item) => item.showInForm)
      .filter((item) => {
        return (
          item.permission !== "DENY" &&
          item.constraintType !== "PRIMARY_KEY" &&
          (item.systemAttribute == false ||
            (item.systemAttribute && showSystemAttributes))
        );
      })
      .map((attr: Attribute) => {
        return {
          column:
            attr.type === "LOOKUP"
              ? lookupSettings === "code" || lookupSettings === undefined
                ? `${attr.name}_code`
                : lookupSettings === "codename"
                ? `${attr.name}_code,${attr.name}_name`
                : `${attr.name}_name,${attr.name}_code`
              : attr.name,
          name: attr.displayName || attr.name,
          canAutoResize: true,
          isSortable: true,
          isFilterable: true,
          dataType: this.getColumnDataType(attr),
          options: this.getOptions(attr),
          width: attr.width || 0,
          pipe: (data: any) => {
            return this.getTransform(data, attr);
          },
          isLink: attr.dataType === "LINK",
        };
      });
  }

  private getColumnDataType(
    attr: Attribute
  ): "string" | "number" | "date" | "category" | "boolean" {
    switch (attr.dataType) {
      case "STRING_VAR":
      case "TEXT":
      case "LINK":
        return "string";
      case "TIME_STAMP":
        return "date";
      case "BOOLEAN":
        return "boolean";
      case "INTEGER":
      case "SERIAL":
      case "DECIMAL":
      case "AUTO":
        return "number";
      default:
        return "string";
    }
  }

  private getOptions(
    attr: Attribute
  ): { name: string; value: any }[] | undefined {
    let options = undefined;
    if (attr.dataType === "BOOLEAN") {
      options = [
        { name: "True", value: true },
        { name: "False", value: false },
      ];
    }
    return options;
  }

  private getTransform(data: any, attr: Attribute) {
    if (attr.dataType === "BOOLEAN") {
      return data ? "True" : "False";
    } else if (attr.dataType === "INTEGER" || attr.dataType === "DECIMAL") {
      if (attr.formatter === "(####)") {
        if (data < 0) {
          return `(${data * -1})`;
        }
      }
      return data;
    } else if (attr.dataType === "TIME_STAMP" && data !== null) {
      let formattedData = data;
      try {
        formattedData = moment(data).format(attr.formatter || "MM/DD/YYYY");
      } catch (err) {
        console.error(err);
      }
      return formattedData;
    }
    return data;
  }
}

