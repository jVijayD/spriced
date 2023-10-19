import { ChangeDetectorRef, Component, EventEmitter, Input, Output } from '@angular/core';
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
import { ServiceTokens, FormDataFetchService } from '@spriced-frontend/shared/spriced-shared-lib';
import { DateAdapterService } from '@spriced-frontend/spriced-common-lib';
import { DynamicFormService, FORM_DATA_SERVICE, SnackBarService } from '@spriced-frontend/spriced-ui-lib';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { NGX_MAT_DATE_FORMATS, NgxMatDateAdapter, NgxMatDatetimePickerModule, NgxMatTimepickerModule } from '@angular-material-components/datetime-picker';
import { RouterModule } from '@angular/router';
import { MatRadioModule } from '@angular/material/radio';
import { MatMenuModule } from '@angular/material/menu';

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
    dateInput: 'MM/DD/YYYY', // Specifies the format for displaying dates in the input field
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
    MatRadioModule,
    MatMenuModule
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
  @Input() public actionType: any;
  @Input() public preview!: boolean;
  public Value: boolean = false;
  public maxValue: boolean = false;
  public minValue: boolean = false;
  @Input() public dataRules: any;
  public dataType: any = 'AUTO';
  public dynamicInputType: any;
  public filteredAttributes: any;

  public onChange: any = () => { }
  public onTouch: any = () => { }
  public value = "" // this is the updated value that the class accesses
  public valueConstant: boolean = true;
  public isFieldDisabled: boolean = false;
  public selectedAttribute: any = '';
  public selectedOperand: any = '';


  constructor(
    private cdr: ChangeDetectorRef
  ) { }

  /**
   *  Initialization tasks or data fetching can be done here
   */
  ngOnInit(): void {
    // CURRENTLY HARD CODE FOR CHANGE THE NAME OF CONST TO VALUE
    this.dataRules?.operands.map((el: any) => {
      el.name === 'const' ? el.name = 'value' : '';
      return
    });
    this.filteredAttributes = this.dataRules?.attributes.filter((el: any) => el.type !== 'LOOKUP');

    const value = this.getValue('actionType');
    const operandType = this.getValue('operandType');
    const attributeId = this.getValue('attributeId');
    const operand = this.getValue('operand');
    const parentAttributeId = this.getValue('parentAttributeId');
    const parentOperandId = this.getValue('parentOperandId');

    this.setAttributeNamesById(attributeId, operand);
    this.handleValue(operandType);
    this.handleParentAttributes(attributeId, parentAttributeId, parentOperandId, operand);
    this.handleValueChange(value);
  }

  // Helper function to get values from actionForm
  private getValue(controlName: string) {
    return this.actionForm?.get(controlName)?.value;
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
      this.selectedOperand = '';
    }

    // HANDLING VALIDATION OR FILED ENABLE OR DISABLE
    if (['MUST_BE_BETWEEN', 'IS_BETWEEN', 'IS_NOT_BETWEEN'].includes(value)) {
      this.Value = false;
      this.minValue = this.maxValue = true;

      minValueControl?.enable();
      maxValueControl?.enable();
      valueControl?.disable();
    }
    else if (['IS_REQUIRED', 'IS_NOT_VALID', 'IS_NULL', 'IS_BLANK'].includes(value)) {
      this.Value = this.maxValue = this.minValue = false;
      // const operandType = this.actionForm?.get('operandType')?.value;
      this.actionForm?.get('operandType').setValue('CONSTANT');
      this.valueConstant = true;
      this.disableFormControl();
      this.removeValidators(valueControl);

      minValueControl?.disable();
      maxValueControl?.disable();
    } else {
      this.Value = true;
      this.maxValue = this.minValue = false;

      minValueControl?.disable();
      maxValueControl?.disable();
      this.isFieldDisabled ? this.removeValidators(valueControl) : this.addValidators(valueControl);
      this.disableOperandFormControl(this.valueConstant);
    } 
    this.cdr.detectChanges();
  }
  /**
     * HANDLE THIS FUNCTION FOR VALIDATION 
     * @param value any
     */
  public handleAttributes(id: any, text?: string) {
    let attribute = this.findAttributeInArray(id, this.dataRules?.attributes);
    const actionType = this.getValue('actionType');
    // If not found, search within nested attributes
    if (!attribute) {
      this.dataRules?.attributes.some((el: any) => {
        attribute = this.findAttributeInArray(id, el?.attributes);
        return !!attribute;
      });
    }
    this.dataType = attribute?.dataType ? attribute?.dataType : 'AUTO';
    const decimalValueSize = attribute?.size;
    this.actionForm?.get('operand')?.setValidators([Validators.required, Validators.pattern('')]);
    this.dynamicInputType = ['INTEGER', 'DECIMAL','DOUBLE'].includes(this.dataType) ? 'number' : 'text';
    if (text === 'changeAttribute') {
      this.actionForm?.patchValue({ operand: '', min_value: '', max_value: '' });
    }
    if (['DECIMAL', 'FLOAT', 'LINK','DOUBLE'].includes(this.dataType)) {
      const pattern = this.getValidationPatternForDataType(this.dataType, decimalValueSize);
      this.actionForm?.get('operand')?.setValidators([Validators.required, Validators.pattern(pattern)]);
    }

    this.handleValueChange(actionType, 'changeValue');
  }

  /**
 * HANDLE THIS FUNCTION FOR CHANGE THE OPERANDS TYPE
 * @param event any
 * @param text string
 */
  public handleValue(event: any, text?: string) {
    this.valueConstant = ['CONSTANT', 'BLANK'].includes(event);
    const valueControl = this.actionForm?.get('operand');
    this.isFieldDisabled = event === 'BLANK';
    this.selectedOperand = '';
    if (text === 'editValue') {
      this.disableFormControl();
    }
    if (event === 'CONSTANT') {
      this.removeValidators(valueControl);
    } else {
      this.addValidators(valueControl);
    }
  }

  public disableOperandFormControl(valueConstant: any)
  {
    const valueControl = this.actionForm?.get('operand');
    if (valueConstant) {
      this.removeValidators(valueControl);
    }
    else {
      this.addValidators(valueControl)
    }
  }

  public disableFormControl() {
    const controlNames = [
      'operand',
      'operandName',
      'operandDisplayName',
      'parentOperandId',
      'parentOperandName',
      'parentOperandDisplayName',
      'operandTableName',
    ];

    controlNames.forEach((controlName) => {
      this.actionForm?.get(controlName)?.setValue('');
    });
  }

  public removeValidators(valueControl: any) {
    valueControl.clearValidators();
    valueControl.updateValueAndValidity();
  }

  public addValidators(valueControl: any) {
    valueControl.setValidators(Validators.required);
    valueControl.updateValueAndValidity();
  }

  public capitalizeOperatorType(value: any): string {
    return value.replace(/_/g, ' ').replace(/\w\S*/g, (word: string) => {
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    });
  }

  public selectAttribute(item: any, parent?: any, type?: string) {
    if (type === 'operand') {
      const value = parent && parent !== '' ? `${parent?.displayName.trim()}.${item.displayName}` : item?.displayName;
      this.selectedOperand = value;
      this.actionForm?.get('operand')?.setValue(item.id);
      this.actionForm?.get('operandName')?.setValue(item.name);
      this.actionForm?.get('operandDisplayName')?.setValue(item.displayName);
      const parentAtt = parent ?? '';
      this.actionForm?.get('parentOperandId')?.setValue(parentAtt.id ?? '');
      this.actionForm?.get('parentOperandDisplayName')?.setValue(parentAtt.displayName ?? '');
      this.actionForm?.get('parentOperandName')?.setValue(parentAtt.name ?? '');
      this.actionForm?.get('operandTableName')?.setValue(parentAtt.referencedTable ?? '');
    }
    else {
      const value = parent && parent !== '' ? `${parent?.displayName.trim()}.${item.displayName}` : item?.displayName;
      this.selectedAttribute = value;
      this.selectedOperand = '';
      this.disableFormControl();

      this.actionForm?.get('attributeId')?.setValue(item.id);
      this.actionForm?.get('attributeDisplayName')?.setValue(item.displayName);
      this.actionForm?.get('attributeName')?.setValue(item.name);

      const parentAtt = parent ?? '';
      this.actionForm?.get('parentAttributeId')?.setValue(parentAtt.id ?? '');
      this.actionForm?.get('parentAttributeName')?.setValue(parentAtt.name ?? '');
      this.actionForm?.get('parentAttributeDisplayName')?.setValue(parentAtt.displayName ?? '');
      this.actionForm?.get('attributeTableName')?.setValue(parentAtt.referencedTable ?? '');
      this.handleAttributes(item.id, 'changeAttribute');
    }
  }

  public setAttributeNamesById(attributeId: any, operandAttribute: any) {
    const attribute = this.findAttributeById(attributeId);
    const operandAtt = this.findAttributeById(operandAttribute);
    // !!operandAtt ? this.actionForm?.get('operandType')?.setValue('ATTRIBUTE') : this.actionForm?.get('operandType')?.setValue('CONSTANT');
    if (!!attribute) {
      this.actionForm?.get('attributeDisplayName')?.setValue(attribute.displayName);
      this.actionForm?.get('attributeName')?.setValue(attribute.name);
    }
    if (!!operandAtt) {
      this.actionForm?.get('operandName')?.setValue(operandAtt.name);
      this.actionForm?.get('operandDisplayName')?.setValue(operandAtt.displayName);
    }
  }

  /**
  * HANDLE THIS FUNCTION FOR PARENT AND CHILD ATTRIBUTE
  * @param attributeId string
  * @param parentAttributeId string 
  * @param parentOperandId string
  * @param operand string
  */
  public handleParentAttributes(attributeId: string, parentAttributeId?: string, parentOperandId?: string, operand?: string) {
    const attribute = this.findAttributeById(attributeId);
    const parentAttribute = this.findAttributeById(parentAttributeId);
    const operend = this.findAttributeById(operand);
    const parentOperand = this.findAttributeById(parentOperandId);

    const checkValue = [attributeId, parentAttributeId, parentOperandId, operand].every(element => element === '');

    if (checkValue) {
      this.selectedAttribute = '';
      this.selectedOperand = '';
    } else {
      this.selectedAttribute = this.buildSelectedAttribute(attribute, parentAttribute);
      this.selectedOperand = this.buildSelectedOperand(operend, parentOperand);
    }

    this.dataType = attribute?.dataType || 'AUTO';
    const decimalValueSize = attribute?.size;
    this.dynamicInputType = ['INTEGER', 'DECIMAL','DOUBLE'].includes(this.dataType) ? 'number' : 'text';

    if (['DECIMAL', 'FLOAT', 'LINK','DOUBLE'].includes(this.dataType)) {
      const pattern = this.getValidationPatternForDataType(this.dataType, decimalValueSize);
      this.actionForm?.get('operand')?.setValidators([Validators.required, Validators.pattern(pattern)]);
    }
    this.cdr.detectChanges();
  }

  /**
 * HANDLE THIS FUNCTION FOR FIND THE ATTRIBUTE BY ID
 * @param id string
 * @returns 
 */
  private findAttributeById(id: any): any {
    if (id === '') {
      return null;
    }

    let attributeItem: any = null;

    // Look for the attribute directly in the attributes array
    attributeItem = this.findAttributeInArray(id, this.dataRules?.attributes);

    // If not found, search within nested attributes
    if (!attributeItem) {
      this.dataRules?.attributes.some((el: any) => {
        attributeItem = this.findAttributeInArray(id, el?.attributes);
        return !!attributeItem;
      });
    }

    return attributeItem;
  }

  /**
   * HANDLE THIS FUNCTION FOR FIND THE ATTRIBUTE ARRAY
   * @param id string
   * @param array any
   * @returns 
   */
  private findAttributeInArray(id: any, array: any[]): any {
    return array ? array.find((elm: any) => elm.id === id) : null;
  }

  /**
   * HANDLE THIS FUNCTION FOR RETURN THE DISPLAYNAME OF PARENT AND CHILD ATTRIBUTE
   * @param attribute any
   * @param parentAttribute any
   * @returns 
   */
  private buildSelectedAttribute(attribute: any, parentAttribute: any): string {
    return !parentAttribute && !attribute ? '' : !parentAttribute ? attribute?.displayName.trim() : `${parentAttribute?.displayName.trim()}.${attribute.displayName}`;
  }

  /**
   * HANDLE THIS FUNCTION FOR RETURN THE DISPLAYNAME OF PARENT AND CHILD OPERAND
   * @param attribute any
   * @param parentAttribute any
   * @returns 
   */
  private buildSelectedOperand(operand: any, parentOperand: any): string {
    return !parentOperand && !operand ? '' : !parentOperand ? operand?.displayName.trim() : `${parentOperand?.displayName.trim()}.${operand.displayName}`;
  }

  /**
   * HANDLE THIS FUNCTION FOR INPUT PATTERN
   * @param dataType 
   * @param decimalSize 
   * @returns 
   */
  private getValidationPatternForDataType(dataType: string, decimalSize?: number): RegExp {
    const number = decimalSize || 1; // Use decimalSize if provided, or default to 1
    let pattern = '';

    switch (dataType) {
      case 'DECIMAL':
        pattern = `^\\d{1,9}\\.\\d{${number},}$`;
        break;
      case 'FLOAT':
        pattern = `^\\d{1,5}\\.\\d{${number},}$`;
        break;
      case 'LINK':
        pattern = '^(ftp|http|https):\\/\\/[^ "]+$';
        break;
      default:
        pattern = '.';
        break;
    }

    return new RegExp(pattern);
  }

}