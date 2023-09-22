import { Inject, Injectable } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { Subject } from "rxjs";

@Injectable()
export class DynamicFormService {
  private parentForm?: FormGroup;
  roles: string[] = [];
  private extraData = new Map<string, object>();
  private eventSubject = new Subject<EventElement>();
  public eventSubject$ = this.eventSubject.asObservable();

  setParent(formGroup: FormGroup) {
    this.parentForm = formGroup;
  }

  // setValues(values: any) {
  //   this.parentForm?.setValue(values);
  // }

  setRoles(roles: string[]) {
    this.roles = roles;
  }

  constructor(@Inject(FORM_DATA_SERVICE) private formService: unknown) {}

  execFun(methodName: string, params: string[]): unknown {
    const paramValues = this.getValues(params);
    return (this.formService as any)[methodName].apply(
      this.formService,
      paramValues
    );
  }

  publishEvent(event: EventElement) {
    this.eventSubject.next(event);
  }

  setFormValues(extraData: Map<string, object> | null, values: any) {
    this.extraData.clear();
    if (extraData) {
      this.extraData = extraData;
    }
    this.parentForm?.setValue(values);
  }

  resetFormValues() {
    this.extraData.clear();
    this.parentForm?.reset();
  }

  getFormValues() {
    return this.parentForm?.value;
  }

  getFormItemValue(item: any) {
    return this.parentForm?.get(item);
  }

  getExtraData() {
    return this.extraData;
  }

  private getValues(params: string[]) {
    const objValues = this.parentForm?.getRawValue();
    const convertedParams: unknown[] = [];
    params.forEach((item) => {
      if (typeof item === "string") {
        if (item.startsWith("$:")) {
          const attrName = item.substring(2, item.length);
          if (Object.prototype.hasOwnProperty.call(objValues, attrName)) {
            convertedParams.push(objValues[attrName]);
          }
        }
      } else {
        convertedParams.push(item);
      }
    });

    return convertedParams;
  }
}

export const FORM_DATA_SERVICE = "FORM_DATA_SERVICE";
export interface EventElement {
  data: unknown;
  type: string;
  value: unknown;
}
