import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS, MatMomentDateModule } from '@angular/material-moment-adapter';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DATE_FORMATS, MAT_DATE_LOCALE, MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { DateAdapterService, ServiceTokens, FormDataFetchService } from '@spriced-frontend/spriced-common-lib';
import { DynamicFormService, FORM_DATA_SERVICE, SnackBarService } from '@spriced-frontend/spriced-ui-lib';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { NGX_MAT_DATE_FORMATS, NgxMatDateAdapter, NgxMatDatetimePickerModule, NgxMatTimepickerModule } from '@angular-material-components/datetime-picker';
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
  selector: 'sp-elseaction',
  standalone: true,
  imports: [
    RouterModule,
    MatIconModule,
    MatSelectModule,
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
  templateUrl: './elseaction.component.html',
  styleUrls: ['./elseaction.component.scss'],
})
export class ElseactionComponent {
  @Input() actionForm!: any;
  @Output() public remove: EventEmitter<any> = new EventEmitter<any>();
  @Input() public dataRules: any;
  @Input() public preview!: boolean;
  @Input() public actionType: any;
  public Value: boolean = false;
  public maxValue: boolean = false;
  public minValue: boolean = false;
  public onChange: any = () => { };
  public onTouch: any = () => { };
  public dataType: any = 'AUTO';
  public value = "";
  public dynamicInputType: any;


  constructor() { }

  /**
   * Initialization tasks or data fetching can be done here
   */
  ngOnInit(): void {
    const value = this.actionForm.get('actionType')?.value;
    const attributeId = this.actionForm.get('attributeId')?.value;
    this.handleValueChange(value);
    this.handleAttributes(attributeId);
  }

  /**
   * HANDLE FOR THIS FUNCTION CHANGE THE ACTIONS VALUE
   * @param value any
   * @param text string
   */
  public handleValueChange(value: any, text?: string) {
    const valueControl = this.actionForm?.get('operand');
    const minValueControl = this.actionForm?.get('min_value');
    const maxValueControl = this.actionForm?.get('max_value');
    // HANDLE FOR EDIT BY CHANGE VALUEf
    if (text === 'changeValue') {
      this.actionForm?.patchValue({ operand: '', min_value: '', max_value: '' });
    }

    // HANDLING VALIDATION OR FILED ENABLE OR DISABLE
    if (['MUST_BE_BETWEEN', 'IS_BETWEEN', 'IS_NOT_BETWEEN'].includes(value)) {
      this.Value = false;
      this.minValue = this.maxValue = true;

      minValueControl?.enable();
      maxValueControl?.enable();
      valueControl?.disable();
    }
    else if (['IS_REQUIRED', 'IS_NOT_VALID', 'NONE'].includes(value)) {
      this.Value = this.maxValue = this.minValue = false;

      minValueControl?.disable();
      maxValueControl?.disable();
      valueControl?.disable();
    } else {
      this.Value = true;
      this.maxValue = this.minValue = false;

      minValueControl?.disable();
      maxValueControl?.disable();
      valueControl?.enable();
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
      this.actionForm?.patchValue({ operand: '', min_value: '', max_value: '' });
    }
    if (['DECIMAL', 'FLOAT'].includes(this.dataType)) {
      const pattern = this.dataType === 'DECIMAL' ? /^(\d{1,9}\.\d{1,})$/ : this.dataType === 'FLOAT' ? /^(\d{1,5}\.\d{1,})$/ : '';
      this.actionForm.get('operand')!.setValidators([Validators.required, Validators.pattern(pattern)]);
    }
  }

}
