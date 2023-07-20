import { Inject, Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Injectable()
export class DynamicFormService {
  parentForm?: FormGroup;
  roles: string[] = [];

  setParent(formGroup: FormGroup) {
    this.parentForm = formGroup;
  }

  setRoles(roles: string[]) {
    this.roles = roles;
  }

  constructor(@Inject(FORM_DATA_SERVICE) private formService: unknown) {}

  execFun(methodName: string, params: string[]): unknown {
    const paramValues = this.getValues(params);
    return (this.formService as any)[methodName].apply(this, paramValues);
  }

  private getValues(params: string[]) {
    const objValues = this.parentForm?.getRawValue();
    const convertedParams: unknown[] = [];
    params.forEach((item) => {
      if (typeof item === 'string') {
        if (item.startsWith('$:')) {
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

export const FORM_DATA_SERVICE = 'FORM_DATA_SERVICE';
