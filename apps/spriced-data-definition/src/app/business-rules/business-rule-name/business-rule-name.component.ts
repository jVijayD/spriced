import { ChangeDetectorRef, Component, OnDestroy, OnInit, Output, Renderer2, ViewChild } from '@angular/core';
import { MatTable } from '@angular/material/table';
import { AppDataService } from '@spriced-frontend/shared/spriced-shared-lib';
import { BusinessruleService } from '@spriced-frontend/spriced-common-lib';
import { FormGroup, FormControl, Validators, FormArray, FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, filter, forkJoin, takeUntil } from 'rxjs';
import { CdkDrag, CdkDragDrop, CdkDragEnter, CdkDragExit, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import * as moment from 'moment';
import { MessageService } from "./../services/message.service";

@Component({
  selector: "sp-business-rule-name",
  templateUrl: "./business-rule-name.component.html",
  styleUrls: ["./business-rule-name.component.scss"],
})
export class BusinessRuleNameComponent implements OnInit, OnDestroy {
  public notifier$: Subject<boolean> = new Subject();
  @ViewChild(MatTable) public table!: MatTable<any>;
  public myForm!: FormGroup;
  public conditionsData: any;

  public column_schema = [
    {
      key: 'Condition',
      type: 'text',
      label: 'Condition'
    },
    {
      key: 'Attribute',
      type: 'text',
      label: 'Attribute'
    },
    {
      key: 'Operator',
      type: 'text',
      label: 'Condition'
    }
  ]
  public sendNotificationData: any = [
    {
      name: 'user',
      groupId: 1
    },
    {
      name: 'user2',
      groupId: 2
    }
  ]
  displayedColumns: string[] = this.column_schema.map(col => col.key);
  public saveButton: boolean = false;
  public loading: boolean = false;
  public rulesData: any;
  public entityId: any;
  public attributes: any;
  public ruleId: any;
  public actionType: any;
  @Output() message: any;
  public previewField: boolean = false;
  public nestedIds: any = [];
  public item: any;
  public idsBr: any;
  public modelId: any;
  public attributeId: any;
  public entityName: any;
  public modelName: any;
  public entities: any = [];

  // DEMO LIST CODE
  public get connectedBRDropListsIds(): string[] {
    // We reverse ids here to respect items nesting hierarchy
    return this.getBRIdsRecursive(this.item).reverse();
  }


  constructor(
    private businessRuleService: BusinessruleService,
    private formbuilder: FormBuilder,
    private router: Router,
    private activeRoute: ActivatedRoute,
    private messageservice: MessageService,
    private renderer: Renderer2,
    private cdRef: ChangeDetectorRef,
    private appStore: AppDataService
  ) {
    // HANDLE THIS FOR WHEN REMOVE THE SUBCONDITIONS
    this.appStore.subConditionForm.subscribe((res: any) => {
      if (!!res) {
        this.removeFormGroupById(this.conditions, res.value.id);
        this.addControlSubConditionType(this.conditions);
        this.conditionsPatchValue(this.conditions);
      }
    });
  }

  /**
   * Initialization tasks or data fetching can be done here
   */
  async ngOnInit() {
    this.loading = true;
    this.formbuild();

    // Handling initial data for Edit Rule
    const ruleId = this.activeRoute?.snapshot?.params?.['id'];
    this.attributeId = this.activeRoute?.snapshot?.queryParams?.['attribute_id'];
    const previewRule = this.activeRoute?.snapshot?.params?.['preview'];
    const entity_id = this.activeRoute?.snapshot?.queryParams?.['entity_id'];
    const model_id = this.activeRoute?.snapshot?.queryParams?.['model_id'];
    this.previewField = !['', undefined, null].includes(previewRule);
    this.modelId = model_id;
    this.entityId = entity_id;

    /**
     * Handling edit rule when rule id is present
     */
    if (!!ruleId) {
      this.businessRuleService.getAllRulesById(ruleId).pipe(takeUntil(this.notifier$)).subscribe(async (res: any) => {
        this.entityId = res.entityId;
        this.rulesData = res;
      });
    }
    this.patchEnumTypes(this.entityId);

    this.item = {
      value: { id: 'parent', subConditions: this.conditions },
      controls: {
        id: 'parent', subConditions: this.conditions
      }
    };
  }

  /**
   * HANDLE THIS FUNCTION FOR GET ALL ENUMS TYPES
   */
  public async patchEnumTypes(id?: any) {
    let { conditions, operands, operators, datatypes, actionEnum, entity, model } = await this.getAllDataEnum(id);
    if (model?.length > 0) {
      const modelData = model.find((el: any) => el.id == this.modelId);
      this.modelName = modelData.displayName;
    }
    if (conditions && operands && operators && actionEnum && entity) {
      this.entityName = entity.displayName;
      const action = actionEnum;
      let attributeList: any = [];
      const relatedRefreneceTableEntity = entity.attributes.filter((el: any) => !!el.referencedTableId);
      attributeList = entity.attributes;
      // Handle for nested attribute
      if (relatedRefreneceTableEntity && relatedRefreneceTableEntity.length > 0) {
        this.entities = [];
        // Use Promise.all to wait for all promises to resolve
        await Promise.all(
          relatedRefreneceTableEntity.map(async (el: any) => {
            if (!(`entity_${el.referencedTableId}` in this.entities)) {
              const { entityData } = await this.getEntityById(el.referencedTableId);
              this.entities[`entity_${el.referencedTableId}`] = entityData;
            }
            const filteredAttributes = this.entities[`entity_${el.referencedTableId}`]?.attributes.filter((el: any) => el.type !== 'LOOKUP');
            this.entities[`entity_${el.referencedTableId}`].attributes = filteredAttributes.filter((attr: any) => !attr.systemAttribute);
            await this.processNestedAttributes(this.entities[`entity_${el.referencedTableId}`].attributes, el);
          })
        )
      }

      attributeList = attributeList.filter((el: any) => !el.systemAttribute);
      this.conditionsData = {
        ...action,
        attributes: attributeList,
        conditions: this.transformObjectToKeyValueArray(conditions),
        operators: this.transformObjectToKeyValueArray(operators),
        operands: this.transformObjectToKeyValueArray(operands),
      };
      this.conditionsData.ruleTypes = this.conditionsData?.ruleTypes.slice(0, 3);

      // Define the names of items to exclude
      const excludedNames = [
        "none",
        "starts_with",
        "does_not_start_with",
        "ends_with",
        "does_not_end_with",
        "contains_pattern",
        "does_not_contain_pattern",
        "contains_subset",
        "does_not_contain_subset",
        "is_between",
        "is_not_between"
      ];

      // Filter the array to exclude items with names in the excludedNames array
      this.conditionsData.operators = this.conditionsData?.operators.filter((item: any) => !excludedNames.includes(item.name));

      if (!!this.rulesData) {
        this.patchForm(this.rulesData);
      }
      const ruleType = this.myForm.get('group')?.value;
      this.handleRuleType(ruleType);
      this.loading = false;
    }
  }

  public handleAttributeNames(attributes: any, parentName?: any) {
    attributes.forEach((attribute: any) => {
      const nestedName = parentName ? `${parentName}.${attribute.name}` : attribute.name;
      attribute.displayName = nestedName;

      if (attribute.attributes) {
        this.handleAttributeNames(attribute.attributes, nestedName);
      }
    });
  }

  /**
  * HANDLE THIS FUNCTION FOR EDIT THE NESTEDATTRIBUTES
  * @param nestedAttributes any
  * @param parentAttribute string
  * @returns 
  */
  public processNestedAttributes(nestedAttributes: any, parentEntity: any) {
    const processedAttributes: any = [];
    if (nestedAttributes) {
      parentEntity.attributes = nestedAttributes;
    }
    return processedAttributes;
  }

  /**
   * HANDLE THIS FUNCTION FOR TRANSFORM OBJECT TO KEY VALUE ARRAY
   * @param obj string
   * @returns 
   */
  public transformObjectToKeyValueArray(obj: Record<string, string>): { name: string; value: string }[] {
    return Object.entries(obj).map(([value, name]) => ({ name, value }));
  }

  /**
   * Handling rule type
   * @param value string
   */
  public handleRuleType(value: string) {
    this.actionType = this.conditionsData?.actions[value];
    this.actions.clear();
    this.elseAction.clear();
  }

  /**
   * HANDLE FOR GET ALL ENUM APIS
   * @returns promise<any>
   */
  public getAllDataEnum(entityId?: any): Promise<any> {
    return new Promise((resolve, rejects) => {
      forkJoin([
        this.businessRuleService.getAllConditionsTypes(),
        this.businessRuleService.getAllOperandsTypes(),
        this.businessRuleService.getAllOperatorsTypes(),
        this.businessRuleService.getAllDataTypes(),
        this.businessRuleService.getConditionsData(),
        this.businessRuleService.getAllEntitesById(entityId),
        this.businessRuleService.getAllModles(),
      ]).subscribe(
        ([conditions, operands, operators, datatypes, actionEnum, entity, model]: any) => {
          resolve({
            conditions,
            operands,
            operators,
            datatypes,
            actionEnum,
            entity,
            model,
          });
        },
        (err) => {
          this.loading = false;
          rejects({
            conditions: [],
            operands: [],
            operators: [],
            datatypes: [],
            actionEnum: [],
            entity: [],
            model: []
          });
        }
      );
    });
  }

  /**
   * HANDLE THIS FUNCTION FOR GET ENTITY BY IDS
   * @param entityId number
   * @returns 
   */
  public getEntityById(entityId: number): Promise<any> {
    return new Promise((resolve, rejects) => {
      forkJoin([
        this.businessRuleService.getAllEntitesById(entityId)
      ]).subscribe(
        ([entityData]: any) => {
          resolve({
            entityData
          });
        },
        (err) => {
          this.loading = false;
          rejects({
            entityData: []
          });
        }
      );
    });
  }

  /**
   * HANDLE FOR THIS FORM GROUP
   */
  public formbuild() {
    this.myForm = this.formbuilder.group({
      name: ['', [Validators.required]],
      priority: ['', [Validators.required, Validators.min(1), Validators.max(1000)]],
      description: ['', [Validators.required]],
      notification: [''],
      group: ['DEFAULT_VALUE_ACTION', [Validators.required]],
      condition: this.formbuilder.array([]),
      action: this.formbuilder.array([], Validators.required),
      elseaction: this.formbuilder.array([]),
    });
  }

  // GET CONDITION FORM GROUP
  get conditions(): FormArray {
    return this.myForm.get("condition") as FormArray;
  }

  // GET ACTIONS FORM GROUP
  get actions(): FormArray {
    return this.myForm.get("action") as FormArray;
  }

  //HANDLE TO GET ELSE CONDITION GROUP
  get elseAction(): FormArray {
    return this.myForm.get('elseaction') as FormArray
  }

  // HANDLE TO GET SUBCONDITIONS GROUP
  public get subConditions(): FormArray {
    const condition = this.myForm.get('condition') as FormArray;
    return condition.controls[0].get('subConditions') as FormArray;
  }

  /**
   * HANDLE ATTRIBUTES BY ENTITY ID
   * @param id any
   */
  public getAllAttribute(id: any) {
    if (id) {
      this.businessRuleService.getAllEntitesById(id).subscribe((res: any) => {
        this.conditionsData.attributes = res.attributes;
      })
    }
  }

  /**
   * HANDLE FOR GET BUSINESS RULE API BY ID
   * @param res any
   */
  public async patchForm(res: any) {
    this.ruleId = res?.id;
    this.myForm = this.formbuilder.group({
      name: [res.name, Validators.required],
      priority: [res.priority, [Validators.required, Validators.min(1), Validators.max(1000)]],
      description: [res.description, [Validators.required]],
      notification: [res.notification],
      group: [res.group],
      condition: this.formbuilder.array([]),
      action: this.formbuilder.array([], [Validators.required]),
      elseaction: this.formbuilder.array([]),
    });
    // CLEAR CONDITION FORM ARRAY
    this.conditions.clear();

    /**
     * CLEAR ACTION FORM ARRAY
     */
    this.actions.clear();

    /**
     * CLEAR ELSE ACTION FORM ARRAY
     */
    this.elseAction.clear();

    /**
     * PUSH DATA IN CONDITIONS FORM ARRAY
     */
    await res.condition.forEach((condition: any) => {
      this.conditions.push(this.patchConditionAndActionForm('condition', condition));
    });
    /**
     * PUSH DATA IN ACTIONS FORM ARRAY
     */
    await Object.entries(res.conditionalAction).map((action: any) => {
      action[1].forEach((item: any) => {
        switch (action[0]) {
          case 'ifActions':
            this.actions.push(this.patchConditionAndActionForm('action', item));
            break;

          case 'elseActions':
            this.elseAction.push(this.patchConditionAndActionForm('action', item));
            break;
        }
      });
    });
  }

  /**
   *  HANDLE FOR PATCH CONDITIONS ACTIONS GROUP FORM
   * @param text string
   * @param item any
   * @returns 
   */
  public patchConditionAndActionForm(text: string, item: any): FormGroup {
    const type = typeof item?.operand;
    const value = type !== 'number' && item?.operand ? item?.operand.split(',') : item?.operand;
    const form: FormGroup = this.formbuilder.group({
      id: [this.generateRandomIds()],
      conditionType: item?.conditionType ? [item.conditionType, Validators.required] : ['', Validators.required],
      attributeId: item?.attributeId ? [item.attributeId, Validators.required] : ['', Validators.required],
      actionType: item?.actionType ? [item.actionType, Validators.required] : ['', Validators.required],
      operatorType: item?.operatorType ? [item.operatorType, Validators.required] : ['', Validators.required],
      operand: item?.operand.toString() ? [item.operand, Validators.required] : ['', Validators.required],
      max_value: value && value[1] ? [value[1], Validators.required] : ['', Validators.required],
      min_value: value && value[0] ? [value[0], Validators.required] : ['', Validators.required],
      operandType: item?.operandType ? [item.operandType, Validators.required] : ['ATTRIBUTE', Validators.required],
      subConditionType: item?.subConditionType ? [item.subConditionType] : ['NONE', Validators.required],
      parentAttributeId: item?.parentAttributeId ? [item.parentAttributeId] : [''],
      attributeName: item?.attributeName ? [item.attributeName] : [''],
      attributeDisplayName: item?.attributeDisplayName ? [item.attributeDisplayName] : [''],
      parentAttributeName: item?.parentAttributeName ? [item.parentAttributeName] : [''],
      parentAttributeDisplayName: item?.parentAttributeDisplayName ? [item.parentAttributeDisplayName] : [''],
      attributeTableName: item?.attributeTableName ? [item.attributeTableName] : [''],
      parentOperandId: item?.parentOperandId ? [item.parentOperandId] : [''],
      operandName: item?.operandName ? [item.operandName] : [''],
      operandDisplayName: item?.operandDisplayName ? [item.operandDisplayName] : [''],
      parentOperandName: item?.parentOperandName ? [item.parentOperandName] : [''],
      parentOperandDisplayName: item?.parentOperandDisplayName ? [item.parentOperandDisplayName] : [''],
      operandTableName: item?.operandTableName ? [item.operandTableName] : [''],
      subConditions: this.formbuilder.array([])
    });

    const subConditionsArray = form.get('subConditions') as FormArray; // Get the FormArray control

    if (!!item.subConditions && item.subConditions.length > 0) {
      // Loop through subConditions and push each subcondition form group to the subConditions array
      item.subConditions.forEach((subCondition: any) => {
        const subConditionFormGroup = this.patchsubConditionsForm(subCondition);
        subConditionsArray.push(subConditionFormGroup); // Use push on the FormArray
      });
    }

    switch (text) {
      case 'condition':
        form.removeControl('actionType');
        break;

      case 'action':
        this.removeControls(form);
        break;
    }

    this.item = {
      value: { id: 'parent', subConditions: this.conditions },
      controls: {
        id: 'parent', subConditions: this.conditions
      }
    };
    return form;
  }

  /**
   * HANDLE FOR PUSH ITEMS IN SUBCONDITIONS ARRAY
   * @param subcondition any
   */
  public patchsubConditionsForm(item: any): FormGroup {
    const value = item?.operand ? item?.operand.split(',') : '';
    const form: FormGroup = this.formbuilder.group({
      id: [this.generateRandomIds()],
      conditionType: item?.conditionType ? [item.conditionType, Validators.required] : ['', Validators.required],
      attributeId: item?.attributeId ? [item.attributeId, Validators.required] : ['', Validators.required],
      operatorType: item?.operatorType ? [item.operatorType, Validators.required] : ['', Validators.required],
      operand: item?.operand && !item?.operand?.max ? [item.operand, Validators.required] : ['', Validators.required],
      max_value: value && value[1] ? [value[1], Validators.required] : ['', Validators.required],
      min_value: value && value[0] ? [value[0], Validators.required] : ['', Validators.required],
      operandType: item?.operandType ? [item.operandType, Validators.required] : ['ATTRIBUTE', Validators.required],
      attributeName: item?.attributeName ? [item.attributeName] : [''],
      attributeDisplayName: item?.attributeDisplayName ? [item.attributeDisplayName] : [''],
      parentAttributeId: item?.parentAttributeId ? [item.parentAttributeId] : [''],
      parentAttributeName: item?.parentAttributeName ? [item.parentAttributeName] : [''],
      parentAttributeDisplayName: item?.parentAttributeDisplayName ? [item.parentAttributeDisplayName] : [''],
      attributeTableName: item?.attributeTableName ? [item.attributeTableName] : [''],
      parentOperandId: item?.parentOperandId ? [item.parentOperandId] : [''],
      operandName: item?.operandName ? [item.operandName] : [''],
      operandDisplayName: item?.operandDisplayName ? [item.operandDisplayName] : [''],
      parentOperandName: item?.parentOperandName ? [item.parentOperandName] : [''],
      parentOperandDisplayName: item?.parentOperandDisplayName ? [item.parentOperandDisplayName] : [''],
      operandTableName: item?.operandTableName ? [item.operandTableName] : [''],
      subConditionType: item?.subConditionType ? [item.subConditionType] : ['NONE', Validators.required],
      subConditions: this.formbuilder.array([])
    });

    const subConditionsArray = form.get('subConditions') as FormArray; // Get the FormArray control

    if (!!item.subConditions && item.subConditions.length > 0) {
      // Loop through subConditions and push each subcondition form group to the subConditions array
      item.subConditions.forEach((subCondition: any) => {
        const subConditionFormGroup = this.patchsubConditionsForm(subCondition);
        subConditionsArray.push(subConditionFormGroup); // Use push on the FormArray
      });
    }

    return form;
  }

  /**
   * HANDLE FOR THIS FUNCTION ADD NEW ROW
   * @param text string
   */
  public handleAddNewRow(text: string) {
    // ADD CONDITIONS AND ACTIONS FORM GROUP AND PUSH FORM
    let formGroup: FormGroup = this.formbuilder.group({
      id: [this.generateRandomIds()],
      attributeId: ['', Validators.required],
      attributeName: [''],
      attributeDisplayName: [''],
      parentAttributeId: [''],
      parentAttributeName: [''],
      parentAttributeDisplayName: [''],
      attributeTableName: [''],
      operand: ['', Validators.required],
      operandName: [''],
      operandDisplayName: [''],
      parentOperandId: [''],
      parentOperandName: [''],
      parentOperandDisplayName: [''],
      operandTableName: [''],
      max_value: ['', Validators.required],
      min_value: ['', Validators.required],
      conditionType: ['', Validators.required],
      operatorType: ['', Validators.required],
      actionType: ['', Validators.required],
      operandType: ['ATTRIBUTE', Validators.required],
      subConditionType: ['NONE', Validators.required],
      subConditions: this.formbuilder.array([])
    });


    // add nesteddrop id's
    const index = this.conditions.length;
    this.nestedIds.push(formGroup.get('id')!.value);

    /**
     * ADD CONTROLS DEPENDS ON FORM CONDITION
     */
    switch (text) {
      case 'condition':
        formGroup.removeControl('actionType');
        this.conditions.push(formGroup);
        this.conditions.controls.forEach((item: any, i: number) => {
          if (index !== i) {
            item.get('conditionType')?.value !== 'NONE' ? item.get('conditionType')?.value : item.get('conditionType')?.patchValue('');
          }
          else {
            this.conditions.controls[index].get('conditionType')?.patchValue('NONE');
          }
        })
        break;
      case 'action':
        this.removeControls(formGroup);
        this.actions.push(formGroup);
        break;
      case 'elseaction':
        this.removeControls(formGroup);
        this.elseAction.push(formGroup);
        break;
      default:
    }
    this.cdRef.detectChanges();
    this.businessRuleService.ruleChageDetection.next(true);

  }

  // Common method to remove controls
  public removeControls(formGroup: FormGroup): void {
    const controlNames = [
      'conditionType',
      'operatorType',
      'subConditions',
      'subConditionType'
    ];

    controlNames.forEach((controlName) => {
      formGroup?.removeControl(controlName); // Call removeControl with the controlName
    });
  }

  /**
   *  HANDLE FOR REMOVE ROW
   * @param text string
   * @param index number
   */
  public removeRow(text: any, index?: any) {
    switch (text) {
      case 'condition':
        this.conditions.removeAt(index);
        break;

      case 'action':
        this.actions.removeAt(index);
        break;

      case 'elseaction':
        this.elseAction.removeAt(index);
        break;
      default:
    }
  }

  /**
   * Handling for drag and drop items
   * @param event cdkdragdrop
   * @param text string
   */
  drop(event: CdkDragDrop<any>, text: string) {
    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    }
  }


  /**
   * Predicate function that only allows even numbers to be
   * sorted into even indices and odd numbers at odd indices.
   */
  sortPredicate(index: number, item: CdkDrag<number>) {
    return true
  }

  public generateRandomIds() {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890_-'
    let result = '';
    for (let i = 0; i < 20; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result
  }

  /**
   * HANDLE THIS FUNCTION FOR NESTED DROP ITEMS
   * @param event any
   */
  // event: CdkDragDrop<any>
  onDragDropBusinessRule(event: any) {
    event.container.element.nativeElement.classList.remove('active');
    if (this.canBRBeDropped(event)) {
      const movingItem: any = event.item.data;
      event.container.data.controls.subConditions.push(movingItem);
      this.removeConditions(event.previousContainer.data, movingItem.value.id);
      this.addControlSubConditionType(this.conditions);
      this.conditionsPatchValue(this.conditions);

    } else {
      moveItemInArray(
        event.container.data.controls.subConditions,
        event.previousIndex,
        event.currentIndex
      );
    }
    this.cdRef.detectChanges();
    this.businessRuleService.ruleChageDetection.next(true);
  }

  /**
   * HANDLE FUNCTION FOR PATCHVALUE IN CONDITIONFORM
   * @param conditions any
   */
  public conditionsPatchValue(conditions: any) {
    let lastIndex = conditions.length - 1;
    conditions.controls.forEach((element: any, index: number) => {
      if (lastIndex !== index) {
        element.get('conditionType')?.value !== 'NONE' ? element.get('conditionType')?.value : element.get('conditionType')?.patchValue('');
      }
      else {
        conditions.controls[lastIndex].get('conditionType')?.patchValue('NONE');
      }
      if (!!element.value.subConditions.length) {
        this.conditionsPatchValue(element.get('subConditions'));
      }
    });
  }

  public addControlSubConditionType(conditions: any) {
    conditions.controls.forEach((element: any) => {
      if (!!element.value.subConditions.length) {
        ['NONE', ''].includes(element.value.subConditionType) ? element.get('subConditionType')?.patchValue('AND') : '';
        this.addControlSubConditionType(element.get('subConditions'));
      }
      else {
        element.get('subConditionType')?.patchValue('NONE');
      }
    });
  }

  /**
   * HANDLE THIS FUNCTION FOR REMOVE FORMARRAY
   * @param data any
   * @param id string 
   */
  removeConditions(data: any, id: string) {
    const index = data.controls.subConditions.value.findIndex(
      (child: any) => child.id == id
    );
    if (index > -1) {
      data.controls.subConditions.removeAt(index);
    }
    // if (!!data.controls.subConditions.value.length) {
    //   !data.controls.subConditions.value.forEach((element: any, index: number) => {
    //     if (!!element.subConditions.value.length) {
    //       this.removeConditions(data.controls.subConditions.at(index), id);
    //     }
    //   });
    // }
  }

  /**
   * HANDLE THIS FUNCTION FOR REMOVE FORMGROUP BY ID RECURSIVE METHOD
   * @param formGroup formgroup
   * @param id string
   * @returns 
   */
  removeFormGroupById(formGroup: FormGroup | FormArray, id: string) {
    if (formGroup instanceof FormGroup) {
      if (formGroup.get('id')?.value === id) {
        // Remove the matching form group from its parent
        const parentArray = formGroup.parent as FormArray;
        if (parentArray) {
          const index = parentArray.controls.indexOf(formGroup);
          if (index !== -1) {
            parentArray.removeAt(index);
            return; // Exit the function once removed
          }
        }
      }

      // Recursively call for subConditions form control
      const subConditionsControl = formGroup.get('subConditions') as FormArray;
      if (subConditionsControl instanceof FormArray) {
        subConditionsControl.controls.forEach(control => {
          this.removeFormGroupById(control as FormGroup, id);
        });
      }
    } else if (formGroup instanceof FormArray) {
      // Recursively call for each control in the FormArray
      formGroup.controls.forEach(control => {
        this.removeFormGroupById(control as FormGroup | FormArray, id);
      });
    }
    // WHEN CONDITION LENGTH ONLY ONE THEN CONDITIONTYPE IS NONE
    if (this.conditions.length === 1) {
      const conditionTypeControl = this.conditions.controls[0].get('conditionType');
      if (conditionTypeControl?.value !== 'NONE') {
        conditionTypeControl?.patchValue('NONE');
      }
    }
  }

  /**
   * HANDLE RECURSIVE IDS FOR SUBCONDITIONS
   * @param element 
   * @returns 
   */
  private getBRIdsRecursive(element: any): string[] {
    this.idsBr = [element.value.id];
    element.value.subConditions.controls.forEach((childItem: any) => {
      this.idsBr = this.idsBr.concat(this.getBRIdconditionsRecursive(childItem));
    });
    return this.idsBr;
  }

  private getBRIdconditionsRecursive(element: any): string[] {
    this.idsBr = [element.value.id];
    element.controls.subConditions.controls.forEach((childItem: any) => {
      this.idsBr = this.idsBr.concat(this.getBRIdconditionsRecursive(childItem));
    });
    return this.idsBr;
  }

  private canBRBeDropped(event: CdkDragDrop<any, any>): boolean {
    const movingItem: any = event.item.data;

    return (
      event.previousContainer.id !== event.container.id &&
      this.isNotBRSelfDrop(event) &&
      !this.hasBRChild(movingItem, event.container.data)
    );
  }

  private isNotBRSelfDrop(
    event: CdkDragDrop<any> | CdkDragEnter<any> | CdkDragExit<any>
  ): boolean {
    return event.container.data.value.id !== event.item.data.value.id;
  }

  private hasBRChild(parentItem: any, childItem: any): boolean {
    parentItem = parentItem.value || parentItem;
    const hasChild = parentItem.subConditions.some(
      (item: any) => item.id === childItem.value.id
    );
    return hasChild
      ? true
      : parentItem.subConditions.some((item: any) => this.hasBRChild(item, childItem));
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
      attributeItem = this.findAttributeInArray(id, this.conditionsData?.attributes);
  
      // If not found, search within nested attributes
      if (!attributeItem) {
        this.conditionsData?.attributes.some((el: any) => {
          attributeItem = this.findAttributeInArray(id, el?.attributes);
          return !!attributeItem;
        });
      }
  
      return attributeItem;
    }  

  /**
   * HANDLE CONDITIONS AND SUBCONDITIONS VALUES
   * @param conditions any
   */
  public conditionAndSubcondition(conditions: any) {
    conditions.forEach((condition: any) => {
      condition.operand = condition.operandType === 'BLANK' ? '' : condition.operand;
      const attribute = this.findAttributeById(condition.attributeId);
      if (['DATE', 'TIME_STAMP', 'DATE_TIME'].includes(attribute?.dataType)) {
        condition.operand = moment(condition.operand).toISOString();
        condition.min_value = moment(condition.min_value).toISOString();
        condition.max_value = moment(condition.max_value).toISOString();
      }
      if(['DECIMAL', 'INTEGER'].includes(attribute?.dataType) && !!condition?.operand && condition?.operand !== '')
        {
          condition.operand = +condition.operand;
        }
      if (['MUST_BE_BETWEEN', 'IS_BETWEEN', 'IS_NOT_BETWEEN'].includes(condition.operatorType)) {
        condition.operand = `${condition.min_value},${condition.max_value}`;
      } else if (['NONE'].includes(condition?.operatorType)) {
        condition.operand = '';
        condition.operandType = 'BLANK';
      }
      delete condition.min_value;
      delete condition.max_value;

      if (condition.subConditions?.length > 0) {
        this.conditionAndSubcondition(condition.subConditions); // Recursively process subconditions
      }
    });
  }

  /**
   * HANDLE THIS FUNCTION FOR SAVE THE FORM DATA
   */
  public async onSubmit(item: any, text?: any) {
    // ADD PARAM
    const dataItem: any = item = {
      name: item.name,
      priority: item.priority,
      description: item.description,
      notification: '',
      group: item.group,
      condition: item.condition,
      entityId: +this.entityId,
      isExcluded: this.rulesData && text !== 'save' ? this.rulesData.isExcluded : false,
      status: this.rulesData ? this.rulesData.status : 'In Progress',
      conditionalAction: {
        ifActions: item.action,
        elseActions: item.elseaction
      },
      id: this.ruleId
    }
    this.saveButton = true;

    // EDIT FOR ACTIONS VALUE
    Object.entries(dataItem.conditionalAction).map((action: any) => {
      action[1].forEach((item: any) => {
        item.actionGroup = dataItem.group;
        const attribute = this.findAttributeById(item.attributeId);
        if (['DATE', 'TIME_STAMP', 'DATE_TIME'].includes(attribute?.dataType)) {
          item.operand = moment(item.operand).toISOString();
          item.min_value = moment(item.min_value).toISOString();
          item.max_value = moment(item.max_value).toISOString();
        }
        if(['DECIMAL', 'INTEGER'].includes(attribute?.dataType) && !!item?.operand && item?.operand !== '')
        {
          item.operand = +item.operand;
        }
        if (item?.actionType === 'MUST_BE_BETWEEN') {
          item.operand = `${item.min_value},${item.max_value}`;
        } else if (['IS_REQUIRED', 'IS_NOT_VALID'].includes(item?.actionType)) {
          item.operand = '';
        }
        delete item.min_value;
        delete item.max_value;
      });
    });

    // EDIT FOR CONDITIONS VALUES
    await this.conditionAndSubcondition(dataItem.condition);
    // PARAM FOR UPDATE AND INSERT THE BUSINESS RULE
    const param = dataItem;
    const updateParam = { ...param, id: this.ruleId };

    // CALL BUSINESSRULE UPDATE AND INSERT POST API
    (this.ruleId && text !== 'save' ? this.businessRuleService.updateBusinessRule(this.ruleId, updateParam) : !this.ruleId && text === 'save' ? this.businessRuleService.saveBusinessRule(updateParam) : !!this.ruleId && text === 'save' ? this.businessRuleService.updateSaveBusinessRule(this.ruleId, updateParam) : this.businessRuleService.insertBusinessRule(param)).subscribe((res: any) => {
      const message: any = this.ruleId ? 'Rule is updated successfully!' : 'Rule is created successfully!';
      this.messageservice.snackMessage.next(message);
      this.router.navigate(['/spriced-data-definition/rules/rule-management'], {
        queryParams: { entity_id: this.entityId, model_id: this.modelId, attribute_id: this.attributeId },
      });
    },
      // Handle the api error as needed
      (error: any) => {
        console.error('Error occurred during API request:', error);
        this.messageservice.snackMessage.next('Error occurred during API request:')
        this.router.navigate(['/spriced-data-definition/rules/rule-management'], {
          queryParams: { entity_id: this.entityId, model_id: this.modelId, attribute_id: this.attributeId },
        });
        this.saveButton = false;
      });
  }

  public backToListpage() {
    this.router.navigate(['/spriced-data-definition/rules/rule-management'], {
      queryParams: { entity_id: this.entityId, model_id: this.modelId, attribute_id: this.attributeId },
    });
  }

  /**
   * The ngOnDestroy lifecycle hook in Angular is used to perform cleanup tasks when a component is about to be destroyed.
     It is called just before the component is removed from the DOM.
   */
  ngOnDestroy() {
    this.router.navigate([], { queryParams: {} });
    this.notifier$.next(true);
    this.notifier$.complete();
  }

}
