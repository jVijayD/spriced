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
import { MatMenuModule} from '@angular/material/menu';
import { Subscription } from "rxjs";
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';

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
    MatMenuModule,
    NgxMatSelectSearchModule
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
export class BusinessRuleListComponent
// extends BaseDataComponent  
{
  // DEMO LIST CODE
  @Input() item?: any;
  @Input() parentItem?: any;
  @Input() preview?: boolean = false;
  @Input() dataRules?: any;
  @Input() index: any;
  @Input() length: any;
  public filteredAttributes:any=[];
  public filteredDbAttributes:any=[]
  public conditionForm?: any;
  public lookupInput: boolean = false;
  public lookupAllAttributeData: any = [];
  public lookupSourceData: any = [];
  public filteredLookupList: any = [];
  public prop: string = "code|name";
  subscriptions: Subscription[] = [];
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
      if (el === true) {
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

    this.setAttributeNamesById(attributeId, operand);
    this.handleValue(operandType);
    this.handleParentAttributes(attributeId, parentAttributeId, parentOperandId, operand);
    this.handleValueChange(value);
    this.filteredAttributes = this.dataRules.attributes;
    this.dataRules.attributes = this.dataRules.attributes.map((item: any) => {
      if (item.attributes) {
        return { ...item, filteredAttributes: item.attributes };
      } else {
        return item;
      }
    });
  }

  // Helper function to get values from conditionForm
  private getValue(controlName: string) {
    return this.conditionForm?.get(controlName)?.value;
  }

  // Helper function to check if conditionType is 'NONE'
  private isConditionTypeNone() {
    return this.conditionForm?.get('conditionType')?.value === 'NONE';
  }

  /**
   * 
   * @param id number
   */
  public loadLookupData(id: number) {
    this.businessruleservice.loadLookupData(id).subscribe({
      next: (res: any) => {
        this.lookupAllAttributeData.push(res.content);
        this.lookupSourceData = res.content;
        this.filteredLookupList = this.lookupSourceData
      },
      error: (err) => {
        console.log(err)
      }
    })
  }

  public editAttributeValue(operator?: any, operandType?: any)
  {
    let item = {
      displayName: 'Id',
      name: 'id',
      id: '1234'
    }
    if(['IS_NULL', 'IS_NOT_NULL', 'HAS_CHANGED'].includes(operator) || operandType === "CONSTANT")
    {
      item = {
        displayName: 'Code',
        name: 'code',
        id: '1234'
      }
    }
    const parentAtt = this.conditionForm?.get('parentAttributeId')?.value;
    if(!['', null, undefined].includes(parentAtt)){
      this.conditionForm?.get('attributeId')?.setValue(item?.id);
      this.conditionForm?.get('attributeDisplayName')?.setValue(item?.displayName);
      this.conditionForm?.get('attributeName')?.setValue(item?.name);
    }
  }

  public selectAttribute(item: any, parent?: any, type?: string) {
    this.lookupInput = false;
    if (type === 'operand') {
      const val = this.conditionForm?.get('attributeId')?.value;
      if(val === '1234')
      {
      this.editAttributeValue();
      }
      const value = parent && parent !== '' ? `${parent?.displayName.trim()}.${item.displayName}` : item?.displayName;
      this.selectedOperand = value;
      this.conditionForm?.get('operand')?.setValue(item.id);
      this.conditionForm?.get('operandName')?.setValue(item.name);
      this.conditionForm?.get('operandDisplayName')?.setValue(item.displayName);
      const parentAtt = parent ?? '';
      this.conditionForm?.get('parentOperandId')?.setValue(parentAtt.id ?? '');
      this.conditionForm?.get('parentOperandDisplayName')?.setValue(parentAtt.displayName ?? '');
      this.conditionForm?.get('parentOperandName')?.setValue(parentAtt.name ?? '');
      this.conditionForm?.get('operandTableName')?.setValue(parentAtt.referencedTable ?? '');
    }
    else {
      let parentAtt = parent ?? '';
      if (!parent && item.type === 'LOOKUP') {
        this.lookupInput = true;
        this.loadLookupData(item?.referencedTableId)
        parentAtt = item;
        item = {
          displayName: 'Code',
          name: 'code',
          id: '1234'
        }
      }
      const value = parentAtt && parentAtt !== '' && !this.lookupInput ? `${parentAtt?.displayName.trim()}.${item.displayName}` : parentAtt && parentAtt !== '' && this.lookupInput ? `${parentAtt?.displayName.trim()}` : item?.displayName;
      this.selectedAttribute = value;
      this.selectedOperand = '';
      this.disableFormControl();

      this.conditionForm?.get('attributeId')?.setValue(item?.id);
      this.conditionForm?.get('attributeDisplayName')?.setValue(item?.displayName);
      this.conditionForm?.get('attributeName')?.setValue(item?.name);
      // const parentAtt = (!parent && item.type) === 'Lookup'?item:parent;
      // const parentAtt = parent ?? '';

      this.conditionForm?.get('parentAttributeId')?.setValue(parentAtt?.id ?? '');
      this.conditionForm?.get('parentAttributeName')?.setValue(parentAtt?.name ?? '');
      this.conditionForm?.get('parentAttributeDisplayName')?.setValue(parentAtt?.displayName ?? '');
      this.conditionForm?.get('attributeTableName')?.setValue(parentAtt?.referencedTable ?? '');
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
    const operatorType = this.conditionForm?.get('operandType')?.value;
    this.editAttributeValue(operatorType, event);
    const attributeId = this.conditionForm?.get('attributeId').value;
    this.setValidatorsPattern(attributeId, this.dataType);
    // this.isFieldDisabled = event === 'BLANK';
    this.selectedOperand = '';
    if (text === 'editValue') {
      this.disableFormControl();
    }
    // if (this.isFieldDisabled) {
    //   const valueControl = this.conditionForm?.get('operand');
    //   this.removeValidators(valueControl);
    // }
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
    // HANDLE FOR EDIT BY CHANGE VALUE
    if (text === 'changeValue') {
      this.conditionForm?.patchValue({ operand: '', min_value: '', max_value: '' });
      this.selectedOperand = '';
    }
    if (['MUST_BE_BETWEEN', 'IS_BETWEEN', 'IS_NOT_BETWEEN'].includes(value)) {
      this.minValue = this.maxValue = true;
      this.value = false;

      minValueControl?.enable();
      maxValueControl?.enable();
      this.removeValidators(valueControl);

    }
    else if (['IS_NULL', 'IS_NOT_NULL', 'HAS_CHANGED'].includes(value)) {
      // const operandType = this.conditionForm?.get('operandType')?.value;
      this.editAttributeValue(value)
      this.conditionForm?.get('operandType').setValue('CONSTANT');
      this.valueConstant = true;
      this.disableFormControl();
      this.removeValidators(valueControl);
      this.value = this.maxValue = this.minValue = false;
      minValueControl?.disable();
      maxValueControl?.disable();
    }
    else {
      this.maxValue = this.minValue = false;
      this.value = true;

      minValueControl?.disable();
      maxValueControl?.disable();

      // this.isFieldDisabled ? this.removeValidators(valueControl) : this.addValidators(valueControl);
    }
  }

  public removeValidators(valueControl: any) {
    valueControl.clearValidators();
    valueControl.updateValueAndValidity();
  }

  public addValidators(valueControl: any) {
    valueControl.setValidators(Validators.required);
    valueControl.updateValueAndValidity();
  }

  public setAttributeNamesById(attributeId: any, operandAttribute: any) {
    const attribute = this.findAttributeById(attributeId);
    const operandAtt = this.findAttributeById(operandAttribute);
    // !!operandAtt ? this.conditionForm?.get('operandType')?.setValue('ATTRIBUTE') : this.conditionForm?.get('operandType')?.setValue('CONSTANT');
    if (!!attribute) {
      this.conditionForm?.get('attributeDisplayName')?.setValue(attribute.displayName);
      this.conditionForm?.get('attributeName')?.setValue(attribute.name);
    }
    if (!!operandAtt) {
      this.conditionForm?.get('operandName')?.setValue(operandAtt.name);
      this.conditionForm?.get('operandDisplayName')?.setValue(operandAtt.displayName);
    }
  }

  /**
   * HANDLE THIS FUNCTION FOR VALIDATION 
   * @param value any
   */
  public handleAttributes(id: any, text?: string) {
    let attribute = this.findAttributeInArray(id, this.dataRules?.attributes);
    const operatorType = this.getValue('operatorType');
    // If not found, search within nested attributes
    if (!attribute) {
      this.dataRules?.attributes.some((el: any) => {
        attribute = this.findAttributeInArray(id, el?.attributes);
        return !!attribute;
      });
    }
    this.dataType = attribute?.dataType || 'AUTO';
    this.setValidatorsPattern(id, this.dataType);
    this.handleValueChange(operatorType, 'changeValue');
  }

  public setValidatorsPattern(id: any, dataType: any) {
    let attribute = this.findAttributeInArray(id, this.dataRules?.attributes);
    const decimalValueSize = attribute?.size;
    this.conditionForm?.get('operand')?.setValidators([Validators.required, Validators.pattern('')]);
    this.dynamicInputType = ['INTEGER', 'DECIMAL', 'DOUBLE'].includes(this.dataType) ? 'number' : 'text';
    if (['FLOAT', 'LINK', 'DOUBLE'].includes(this.dataType)) {
      const pattern = this.getValidationPatternForDataType(this.dataType, decimalValueSize);
      this.conditionForm?.get('operand')?.setValidators([Validators.required, Validators.pattern(pattern)]);
    }
    if (!this.valueConstant) {
      this.conditionForm?.get('operand')?.setValidators(Validators.required, Validators.pattern(''));
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
    let attribute: any = this.findAttributeById(attributeId);
    const parentAttribute = this.findAttributeById(parentAttributeId);
    const operend = this.findAttributeById(operand);
    const parentOperand = this.findAttributeById(parentOperandId);
    if (attribute?.id === '1234' || (!attribute && parentAttribute?.referencedTableId)) {
      this.lookupInput = true;
      this.loadLookupData(parentAttribute?.referencedTableId);
      attribute = {
        name: 'code',
        displayName: 'Code',
        id: '1234'
      }
    }

    const checkValue = [attributeId, parentAttributeId, parentOperandId, operand].every(element => element === '');
    if (checkValue) {
      this.selectedAttribute = '';
      this.selectedOperand = '';
    } else {
      this.selectedAttribute = this.buildSelectedAttribute(attribute, parentAttribute);
      this.selectedOperand = this.buildSelectedOperand(operend, parentOperand);
    }

    this.dataType = attribute?.dataType || 'AUTO';
    this.setValidatorsPattern(attributeId, this.dataType);
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

  filterAttributes(value:any,control?:any,text?:string){
    if(text ==='Parent' || value===''){
      this.filteredAttributes = this.dataRules?.attributes.filter((item: any) => {
        return (
          item.displayName
            .trim()
            .toLowerCase()
            .indexOf(value.trim().toLowerCase()) != -1
        );
      });
    }
    if(text==='Nested' || value===''){
      this.filteredDbAttributes = this.dataRules.attributes.filter((item: any) => {
        if (item.type === 'LOOKUP') {
          return item.displayName
            .trim()
            .toLowerCase()
            .includes(value.trim().toLowerCase());
        }
        return false; 
      });
    }
    setTimeout(() => {
    control.focus({
      preventScroll: false
    });
    },200);
  }

  matMenuOpen(control:any)
  {
    control.value = '';
    this.filterAttributes('',control);
    control.focus({
      preventScroll: true
    });
  }
  // matMenuClosed(control:any){
  //   control.value = '';
  //   this.filterAttributes('',control);
  // }

  public filterLookupData(text: string)
  {
    const newData = this.lookupSourceData.map((item: any) => ({ ...item, code: item.code.toString() }));
    this.filteredLookupList = newData.filter((item: any) => {
      return (
        item.code.trim()
          .toLowerCase()
          .indexOf(text.trim().toLowerCase()) != -1
      );
    });
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
    return !!parentAttribute && !!attribute && !this.lookupInput ? `${parentAttribute?.displayName.trim()}.${attribute.displayName}` : !parentAttribute ? attribute?.displayName.trim() : !!parentAttribute && !!attribute && this.lookupInput ? `${parentAttribute?.displayName.trim()}` : '';
  }

  /**
   * HANDLE THIS FUNCTION FOR RETURN THE DISPLAYNAME OF PARENT AND CHILD OPERAND
   * @param attribute any
   * @param parentAttribute any
   * @returns 
   */
  private buildSelectedOperand(operand: any, parentOperand: any): string {
    return !!parentOperand && !!operand ? `${parentOperand?.displayName.trim()}.${operand.displayName}` : !parentOperand ? operand?.displayName.trim() : '';
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
