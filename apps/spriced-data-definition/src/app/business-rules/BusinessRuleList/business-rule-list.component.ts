import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, forwardRef } from '@angular/core';
import { CdkDragDrop, DragDropModule } from '@angular/cdk/drag-drop';
import { FormArray, FormGroup, FormsModule, NG_VALUE_ACCESSOR, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS, MatMomentDateModule } from '@angular/material-moment-adapter';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DATE_FORMATS, MAT_DATE_LOCALE, MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { AppDataService, ServiceTokens, FormDataFetchService } from '@spriced-frontend/shared/spriced-shared-lib';
import { BusinessruleService, DateAdapterService } from '@spriced-frontend/spriced-common-lib';
import { DynamicFormService, FORM_DATA_SERVICE, SnackBarService } from '@spriced-frontend/spriced-ui-lib';
import { CommonModule } from '@angular/common';
import { NGX_MAT_DATE_FORMATS, NgxMatDateAdapter, NgxMatDatetimePickerModule, NgxMatTimepickerModule } from '@angular-material-components/datetime-picker';
import { MatRadioModule } from '@angular/material/radio';
import { RouterModule } from '@angular/router';
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
  @Input() length: any;
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

  public selectedAttribute: any = '';
  public selectedOperand: any = '';

  @Output() itemDrop: EventEmitter<CdkDragDrop<any>>

  constructor(
    private appStore: AppDataService,
    private businessruleservice: BusinessruleService,
    private cdRef: ChangeDetectorRef
  ) {
    this.allDropListsIds = [];
    this.itemDrop = new EventEmitter();
    this.businessruleservice.ruleChageDetection.subscribe((el: any) => {
      if(el === true)
      {
        this.disable = this.isConditionTypeNone();
        // this.cdRef.detectChanges();
      }
    })
  }

  /**
   * Initialization tasks or data fetching can be done here
   */
  ngOnInit() {
    // CURRENTLY HARD CODE FOR CHANGE THE NAME OF CONST TO VALUE
    this.dataRules?.operands.map((el: any) => {
      el.name === 'const' ? el.name = 'value' : '';
      return
    });

    this.conditionForm = this.item?.controls?.id === 'parent' ? this.item.controls.subConditions.controls[0] : this.item;

    this.disable = this.isConditionTypeNone();
    
    const value = this.getValue('operatorType');
    const operandType = this.getValue('operandType');
    const attributeId = this.getValue('attributeId');
    const operand = this.getValue('operand');
    const parentAttributeId = this.getValue('parentAttributeId');
    const parentOperandId = this.getValue('parentOperandId');
    
    this.handleValue(operandType);
    this.handleValueChange(value);
    this.handleParentAttributes(attributeId, parentAttributeId, parentOperandId, operand);
  }

  // Helper function to get values from conditionForm
  private getValue(controlName: string) {
    return this.conditionForm?.get(controlName)?.value;
  }

  // Helper function to check if conditionType is 'NONE'
  private isConditionTypeNone() {
    return this.conditionForm?.get('conditionType')?.value === 'NONE';
  }

  public selectAttribute(item: any, parent?: any, type?: string) {
    if (type === 'operand') {
      const value = parent && parent !== '' ? `${parent?.displayName.trim()}.${item.displayName}` : item?.displayName;
      this.selectedOperand = value;
      this.conditionForm?.get('operand')?.setValue(item.id);
      this.conditionForm?.get('operandName')?.setValue(item.name);
      this.conditionForm?.get('operandDisplayName')?.setValue(item.displayName);
      const parentAtt = parent ?? '';
      this.conditionForm?.get('parentOperandId')?.setValue(parentAtt.id ?? '');
      this.conditionForm?.get('parentOperandDisplayName')?.setValue(parentAtt.displayName ?? '');
      this.conditionForm?.get('parentOperandName')?.setValue(parentAtt.name ?? '');
      this.conditionForm?.get('operandTableName')?.setValue(parentAtt.referencedTableDisplayName ?? '');
    }
    else {
      const value = parent && parent !== '' ? `${parent?.displayName.trim()}.${item.displayName}` : item?.displayName;
      this.selectedAttribute = value;
      this.selectedOperand = '';
      this.disableFormControl();

      this.conditionForm?.get('attributeId')?.setValue(item.id);
      this.conditionForm?.get('attributeDisplayName')?.setValue(item.displayName);
      this.conditionForm?.get('attributeName')?.setValue(item.name);
      
      const parentAtt = parent ?? '';
      this.conditionForm?.get('parentAttributeId')?.setValue(parentAtt.id ?? '');
      this.conditionForm?.get('parentAttributeName')?.setValue(parentAtt.name ?? '');
      this.conditionForm?.get('parentAttributeDisplayName')?.setValue(parentAtt.displayName ?? '');
      this.conditionForm?.get('attributeTableName')?.setValue(parentAtt.referencedTableDisplayName ?? '');
      this.handleAttributes(item.id, 'changeAttribute');
    }
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
    this.selectedOperand = '';
    if (text === 'editValue') {
      this.disableFormControl();
    }
    if (this.isFieldDisabled) {
      this.conditionForm?.get('operand')?.disable();
    }
  }

  public disableFormControl()
  {
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
      this.conditionForm?.get(controlName)?.setValue('');
    });
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
    this.selectedOperand = '';
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
    else if (['IS_NULL','IS_NOT_NULL'].includes(value)) {
      this.conditionForm?.get('operandType').setValue('CONSTANT');
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
    let attribute = this.findAttributeInArray(id, this.dataRules?.attributes);
    // If not found, search within nested attributes
    if (!attribute) {
      this.dataRules?.attributes.some((el: any) => {
        attribute = this.findAttributeInArray(id, el?.attributes);
        return !!attribute;
      });
    }
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
    this.dynamicInputType = ['INTEGER', 'DECIMAL'].includes(this.dataType) ? 'number' : 'text';

    if (['DECIMAL', 'FLOAT', 'LINK'].includes(this.dataType)) {
      const pattern = this.getValidationPatternForDataType(this.dataType);
      this.conditionForm?.get('operand')?.setValidators([Validators.required, Validators.pattern(pattern)]);
    }
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

  private getValidationPatternForDataType(dataType: string): RegExp {
    switch (dataType) {
      case 'DECIMAL':
        return /^(\d{1,9}\.\d{1,})$/;
      case 'FLOAT':
        return /^(\d{1,5}\.\d{1,})$/;
      case 'LINK':
        return /^(ftp|http|https):\/\/[^ "]+$/i;
      default:
        return /./; // Default pattern for other data types
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
  public removeRow(item: any) {
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
