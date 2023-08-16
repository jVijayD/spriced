import { Component, EventEmitter, Input, OnInit, Output, forwardRef } from '@angular/core';
import { CdkDragDrop, DragDropModule } from '@angular/cdk/drag-drop';
import { FormsModule, NG_VALUE_ACCESSOR, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS, MatMomentDateModule } from '@angular/material-moment-adapter';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DATE_FORMATS, MAT_DATE_LOCALE, MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import {  AppDataService,ServiceTokens, FormDataFetchService } from '@spriced-frontend/shared/spriced-shared-lib';
import { DateAdapterService } from '@spriced-frontend/spriced-common-lib';
import { DynamicFormService, FORM_DATA_SERVICE, SnackBarService } from '@spriced-frontend/spriced-ui-lib';
import { CommonModule } from '@angular/common';
import { NGX_MAT_DATE_FORMATS, NgxMatDateAdapter, NgxMatDatetimePickerModule, NgxMatTimepickerModule } from '@angular-material-components/datetime-picker';
import { MatRadioModule } from '@angular/material/radio';
import { RouterModule } from '@angular/router';

const MY_DATE_FORMAT = {
  parse: {
    dateInput: 'LL', // Specifies the input format for parsing dates
    // dateOutput: 'MM/DD/YYYY', // Specifies the output format for displaying dates
  },
  display: {
    dateInput: 'MM/DD/YYYY', // Specifies the format for displaying dates in the input field
    monthYearLabel: 'MMMM YYYY', // Specifies the format for displaying the month and year in the datepicker header
    dateA11yLabel: 'LL', // Specifies the format for accessibility labels of dates
    monthYearA11yLabel: 'MMMM YYYY', // Specifies the format for accessibility labels of the month and year
  },
};

const NGX_DATE_FORMAT = {
  parse: {
    dateInput: '1, LTS', // Specifies the input format for parsing dates
    // dateOutput: 'MM/DD/YYYY', // Specifies the output format for displaying dates
  },
  display: {
    dateInput: 'MM/DD/YYYY HH:mm:ss a', // Specifies the format for displaying dates in the input field
    monthYearLabel: 'MMMM YYYY', // Specifies the format for displaying the month and year in the datepicker header
    dateA11yLabel: 'LL', // Specifies the format for accessibility labels of dates
    monthYearA11yLabel: 'MMMM YYYY', // Specifies the format for accessibility labels of the month and year
  },
};

const sToken = new ServiceTokens();

@Component({
  selector: 'sp-business-rule-list',
  standalone: true,
  imports: [
    RouterModule,
    MatIconModule,
    MatSelectModule,
    MatRadioModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    ReactiveFormsModule,
    FormsModule,
    MatDialogModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatMomentDateModule,
    DragDropModule,
    CommonModule,
    NgxMatDatetimePickerModule,
    NgxMatTimepickerModule,
    MatMomentDateModule,
  ],
  providers: [
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMAT },
    { provide: MAT_DATE_LOCALE, useValue: 'en-US' },
    {
      provide: NgxMatDateAdapter,
      useClass: DateAdapterService,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
    },
    { provide: NGX_MAT_DATE_FORMATS, useValue: NGX_DATE_FORMAT },
    NgxMatDatetimePickerModule,
    NgxMatTimepickerModule,
    MatMomentDateModule,
    DynamicFormService,
    SnackBarService,
    { provide: ServiceTokens, useValue: sToken },
    {
      provide: sToken.getToken(FORM_DATA_SERVICE),
      useClass: FormDataFetchService,
    },
  ],
  templateUrl: './business-rule-list.component.html',
  styleUrls: ['./business-rule-list.component.scss'],
})
export class BusinessRuleListComponent {
  // DEMO LIST CODE
  @Input() item?: any;
  @Input() parentItem?: any;
  @Input() preview?: boolean = false;
  @Input() dataRules?: any;
  @Input() index: any;
  public conditionForm?: any;
  @Input() public set connectedDropListsIds(ids: string[]) {
    this.allDropListsIds = ids;
  }

  @Output() public remove: EventEmitter<any> = new EventEmitter<any>();
  public value: boolean = false;
  public maxValue: boolean = false;
  public minValue: boolean = false;
  public defValue: any;
  public valueConstant: boolean = true;
  public isFieldDisabled: boolean = false;
  public dynamicInputType: any;
  public disable: any;
  public dataType: any = 'AUTO';

  public subConditionType = [
    {
      value: 'AND',
      name: 'and'
    },
    {
      value: 'OR',
      name: 'or'
    }
  ]


  @Output() itemDrop: EventEmitter<CdkDragDrop<any>>

  constructor(
    private appStore: AppDataService
  ) {
    this.allDropListsIds = [];
    this.itemDrop = new EventEmitter();
  }

  /**
   * Initialization tasks or data fetching can be done here
   */
  ngOnInit() {
    this.conditionForm = this.item?.controls?.id === 'parent' ? this.item.controls.subConditions.controls[0] : this.item;

    this.disable = this.conditionForm?.get('conditionType')?.value && this.conditionForm.get('conditionType')?.value === 'NONE';
    const value = this.conditionForm?.get('operatorType')?.value;
    const operandType = this.conditionForm?.get('operandType')?.value;
    const attributeId = this.conditionForm?.get('attributeId')?.value;
    this.handleValueChange(value);
    this.handleValue(operandType);
    this.handleAttributes(attributeId);
  }

  /**
   * HANDLE THIS FUNCTION FOR CHANGE THE OPERANDS TYPE
   * @param event any
   * @param text string
   */
  public handleValue(event: any, text?: string) {
    this.valueConstant = ['CONSTANT', 'BLANK'].includes(event);
    this.conditionForm?.get('operand')?.enable();
    this.isFieldDisabled = event === 'BLANK';
    if (text === 'editValue') {
      this.conditionForm?.get('operand')?.setValue('');
    }
    if (this.isFieldDisabled) {
      this.conditionForm?.get('operand')?.disable();
    }
  }

  /**
   * HANDLE FOR THIS FUNCTION CHANGE THE ACTIONS VALUE
   * @param value any
   * @param text string
   */
  public handleValueChange(value: any, text?: string) {
    const valueControl = this.conditionForm?.get('operand');
    const minValueControl = this.conditionForm?.get('min_value');
    const maxValueControl = this.conditionForm?.get('max_value');
    // HANDLE FOR EDIT BY CHANGE VALUE
    if (text === 'changeValue') {
      this.conditionForm?.patchValue({ operand: '', min_value: '', max_value: '' });
    }
    if (['MUST_BE_BETWEEN', 'IS_BETWEEN', 'IS_NOT_BETWEEN'].includes(value)) {
      this.minValue = this.maxValue = true;
      this.value = false;

      minValueControl?.enable();
      maxValueControl?.enable();
      valueControl?.disable();

    }
    else if (['NONE'].includes(value)) {
      this.value = this.maxValue = this.minValue = false;
      valueControl?.disable();
      minValueControl?.disable();
      maxValueControl?.disable();
    }
    else {
      this.maxValue = this.minValue = false;
      this.value = true;

      minValueControl?.disable();
      maxValueControl?.disable();
      this.isFieldDisabled ? valueControl?.disable() : valueControl?.enable();
    }
  }

  /**
   * HANDLE THIS FUNCTION FOR VALIDATION 
   * @param value any
   */
  public handleAttributes(id: any, text?: string) {
    const attribute = this.dataRules?.attributes.find((el: any) => el.id === id);
    this.dataType = attribute?.dataType ? attribute?.dataType : 'AUTO';
    this.dynamicInputType = ['INTEGER', 'DECIMAL'].includes(this.dataType) ? 'number' : 'text';
    if (text === 'changeAttribute') {
      this.conditionForm?.patchValue({ operand: '', min_value: '', max_value: '' });
    }
    if (['DECIMAL', 'FLOAT', 'LINK'].includes(this.dataType)) {
      const pattern = this.dataType === 'DECIMAL' ? /^(\d{1,9}\.\d{1,})$/ : this.dataType === 'FLOAT' ? /^(\d{1,5}\.\d{1,})$/ : this.dataType === 'LINK' ? /^(ftp|http|https):\/\/[^ "]+$/i : '';
      this.conditionForm?.get('operand')!.setValidators([Validators.required, Validators.pattern(pattern)]);
    }
  }

  /**
   * HANDLE THIS FOR EMIT THE DROP ITEM
   * @param event 
   */
  public onDragDrop(event: any) {
    this.itemDrop.emit(event);
  }

  /**
   * HANDLE THIS FUNCTION FOR EMIT THE FORMGROUP
   * @param item any
   */
  public removeRow(item: any)
  {
    this.appStore.subConditionForm.next(item);
  }
  
  /**
   * HANDLE FOR DROP LIST IDS
   */
  public get connectedDropListsIds(): string[] {
    return this.allDropListsIds.filter((id) => id !== this.item?.value?.id);
  }
  public allDropListsIds: string[];

  public get dragDisabled(): boolean {
    return !this.parentItem;
  }

  public get parentItemId(): string {
    return this.dragDisabled ? '' : this.parentItem?.value!.id;
  }


  public capitalizeOperatorType(value: any): string {
    return value.replace(/_/g, ' ').replace(/\w\S*/g, (word: string) => {
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
  });
}
}
