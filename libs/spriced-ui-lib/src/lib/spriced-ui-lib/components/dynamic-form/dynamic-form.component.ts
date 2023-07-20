import {
  ChangeDetectionStrategy,
  Component,
  //HostListener,
  Input,
} from '@angular/core';
import { DynamicFormService } from './service/dynamic-form.service';
import { AppForm, FormFieldControls } from './dynamic-form.types';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'sp-dynamic-form',
  templateUrl: './dynamic-form.component.html',
  styleUrls: ['./dynamic-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
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

  // @HostListener('window:resize', ['$event'])
  // onResize(event: any) {
  //   const width = event.target.innerWidth;
  //   //this.setColumns(width);
  // }

  constructor(
    private fb: FormBuilder,
    private dynamicService: DynamicFormService
  ) {
    //const width = window.innerWidth;
    //this.setColumns(width);
  }

  getRowAndColumns(grpIndex: number) {
    const fixedControls = this._fixedControls.get(
      grpIndex
    ) as FormFieldControls;
    const cols = this.appFormData?.appForm?.columns || 1;
    return {
      columns: Array(cols).fill(1),
      rows: Array(Math.ceil(fixedControls.length / cols)).fill(1),
    };
  }

  getControl(row: number, col: number, groupIndex: number) {
    const fixedControls = this._fixedControls.get(
      groupIndex
    ) as FormFieldControls;
    const control =
      fixedControls[row * (this.appFormData?.appForm?.columns || 1) + col];
    return control;
  }

  private setFixedControls(appForm: AppForm) {
    appForm.groups.forEach((item, index) => {
      this._fixedControls.set(
        index,
        item.formFieldControls.filter((item: any) => item.subType !== 'hidden')
      );
    });
  }

  // private setColumns(width: number) {
  //   if (width < 576) {
  //     this.columns = 1;
  //   } else if (width >= 576 && width < 768) {
  //     this.columns = 2;
  //   } else if (width >= 768 && width < 992) {
  //     this.columns = 3;
  //   } else if (width >= 992 && width < 1200) {
  //     this.columns = 3;
  //   } else if (width > 1200) {
  //     this.columns = 4;
  //   }
  // }
}

export type AppFormData = {
  appForm?: AppForm;
  form: FormGroup;
};
