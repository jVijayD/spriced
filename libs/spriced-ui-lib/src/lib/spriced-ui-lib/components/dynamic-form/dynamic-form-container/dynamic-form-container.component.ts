import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { AppForm } from '../dynamic-form.types';
import { AppFormData } from '../dynamic-form.component';
import { FormControl, FormGroup } from '@angular/forms';
import { DynamicFormService } from '../service/dynamic-form.service';

@Component({
  selector: 'sp-dynamic-form-container',
  templateUrl: './dynamic-form-container.component.html',
  styleUrls: ['./dynamic-form-container.component.scss'],
  providers: [DynamicFormService],
  //changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DynamicFormContainerComponent {
  private _appForm!: AppForm;
  currentFormData!: AppFormData;
  formSubmitAttempt = false;

  @Output()
  submitEvent = new EventEmitter<FormGroup>();

  @Input()
  set appForm(appForm: AppForm) {
    if (appForm) {
      this._appForm = appForm;
      this.setCurrentFormData();
    }
  }

  get appForm() {
    return this._appForm;
  }

  @Input()
  set roles(roles: string[]) {
    this.dynamicService.setRoles(roles || []);
  }

  @Input()
  save = 'Save';

  @Input()
  reset = 'Reset';

  constructor(private dynamicService: DynamicFormService) {
    this.setCurrentFormData();
  }

  onFormSubmit() {
    this.formSubmitAttempt = true;
    if (this.currentFormData?.form?.valid) {
      this.dispatchSubmitEvent(this.currentFormData?.form);
    }
  }

  onFormReset() {
    this.formSubmitAttempt = false;
    this.currentFormData?.form?.reset({ ...this.itemsNotReset() });
  }

  private dispatchSubmitEvent(form: FormGroup) {
    this.submitEvent.emit(form);
  }

  private setCurrentFormData() {
    if (this.appForm) {
      this.currentFormData = {
        appForm: this.appForm,
        form: this.createForm(this.appForm),
      };
    }
  }

  private createForm(appForm: AppForm): FormGroup {
    const form = new FormGroup(
      this.getAllFormFields(appForm)?.reduce((memo, formField) => {
        return {
          ...memo,
          [formField.name]: new FormControl(
            formField.value,
            formField.validations?.map((val) => val.validator),
            formField.asyncValidations?.map((val) => val.validator)
          ),
        };
      }, {})
    );
    this.dynamicService.setParent(form);
    return form;
  }

  private itemsNotReset() {
    const hiddenItems: Record<string, any> = {};
    this.getAllFormFields(this._appForm).forEach((item) => {
      if (item.type === 'input' && item.subType === 'hidden') {
        hiddenItems[item.name] = item.value;
      }
    });
    return hiddenItems;
  }

  private getAllFormFields(appForm: AppForm) {
    const grpControls = appForm.groups.map((group) => {
      return group.formFieldControls;
    });
    return grpControls.flatMap((x) => x);
  }
}
