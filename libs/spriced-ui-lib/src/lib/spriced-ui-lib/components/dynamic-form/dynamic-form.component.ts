import {
  ChangeDetectionStrategy,
  Component,
  //HostListener,
  Input,
} from "@angular/core";
import { DynamicFormService } from "./service/dynamic-form.service";
import { AppForm, FormFieldControls } from "./dynamic-form.types";
import { FormBuilder, FormGroup } from "@angular/forms";

@Component({
  selector: "sp-dynamic-form",
  templateUrl: "./dynamic-form.component.html",
  styleUrls: ["./dynamic-form.component.scss"],
  //changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DynamicFormComponent {
  private _appFormData: AppFormData = {
    form: new FormGroup({}),
  };
  private _fixedControls = new Map<number, FormFieldControls>();

  //columns = 1;

  @Input()
  set appFormData(appFormData: AppFormData) {
    if (appFormData) {
      this._appFormData = appFormData;
      if (appFormData.appForm) {
        this.setFixedControls(appFormData.appForm);
      }
      if (appFormData.form) {
        this.dynamicService.setParent(appFormData.form);
      }
    }
  }

  get appFormData(): AppFormData {
    return this._appFormData;
  }

  @Input()
  set roles(roles: string[]) {
    this.dynamicService.setRoles(roles || []);
  }

  constructor(
    private fb: FormBuilder,
    private dynamicService: DynamicFormService
  ) {}

  private setFixedControls(appForm: AppForm) {
    appForm.groups.forEach((item, index) => {
      this._fixedControls.set(
        index,
        item.formFieldControls.filter((item: any) => item.subType !== "hidden")
      );
    });
  }
}

export type AppFormData = {
  appForm?: AppForm;
  form: FormGroup;
};
