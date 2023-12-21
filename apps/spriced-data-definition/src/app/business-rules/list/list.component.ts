import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit, Output, OnDestroy, ViewChild, TemplateRef, ChangeDetectorRef } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import {
  AppDataService,
  ErrorPanelService
} from '@spriced-frontend/shared/spriced-shared-lib';
import { BusinessruleService } from '@spriced-frontend/spriced-common-lib';
import {
  DataGridComponent,
  DialogboxComponent,
  Header,
  Paginate,
  SnackBarService,
} from '@spriced-frontend/spriced-ui-lib';
import { ColumnMode, SelectionType, SortType } from '@swimlane/ngx-datatable';
import {
  Subject,
  debounceTime,
  forkJoin,
  takeUntil
} from 'rxjs';
import { MessageService } from './../services/message.service';
@Component({
  selector: "sp-list",
  templateUrl: "./list.component.html",
  styleUrls: ["./list.component.scss"],
})
export class ListComponent implements OnInit, OnDestroy {
  @ViewChild('pagination') paginator!: MatPaginator;
  @ViewChild('dataGrid') dataGrid!: DataGridComponent;
  public subscription: any;
  public notifier$: Subject<boolean> = new Subject();
  public listForm!: FormGroup;
  public models: any = [];
  public entities: any = [];
  public attributes: any = [];
  public defaultAttribute: any;
  public memberTypes = [{ value: 'Leaf', viewValue: 'Leaf' }];
  public filterData: any;
  public entityId: any;
  public modelId: any;
  public currentId: any;
  public pageIndex = 0;
  public pageNo = 0;
  public pageSize = 5;
  public loading = false;
  public dataSource: any = [];
  public currentDataSource: any = [];
  public defaultModel: any;
  public defaultEntity: any;
  public currentAttributeId: string = '';
  public filteredModels: any;
  public filteredAttributes: any;
  public filteredEntites: any;
  displayedColumns: string[] = [
    'Priority',
    'Excluded',
    'Name',
    'Description',
    'Expression',
    'Status',
    'Notification',
    'Modified_Date',
    'Action',
  ];

  headers: Header[] = [
    {
      column: "priority",
      name: "Priority",
      canAutoResize: true,
      isSortable: true,
      width: 100
    },
    {
      column: "isExcluded",
      name: "Excluded",
      canAutoResize: true,
      isSortable: true,
      checkbox: true,
      disableCheckbox: (row: any) => !['Active', 'Excluded'].includes(row.status),
      width: 100
    },
    {
      column: "name",
      name: "Name",
      canAutoResize: true,
      isSortable: true,
      width: 200
    },
    {
      column: "description",
      name: "Description",
      canAutoResize: true,
      isSortable: true,
      width: 200
    },
    {
      column: "expression",
      name: "Expression",
      canAutoResize: true,
      isSortable: true,
      tooltip: true,
      tooltipTemplate: (row: any) => this.getExpressionTooltip(row),
      imgsrc: 'assets/images/file.png',
      width: 100,
      showtooltip:true
    },
    {
      column: "status",
      name: "Status",
      canAutoResize: true,
      isSortable: true,
      width: 150
    },
    // {
    //   column: "notification",
    //   name: "Notification",
    //   canAutoResize: true,
    //   isSortable: true,
    //   width: 120
    // },
    {
      column: "updatedDate",
      name: "Last Updated On",
      canAutoResize: true,
      isSortable: true,
      width: 150,
      pipe: (data: any) => {
        return moment(data).format("MM/DD/YYYY HH:mm:ss");
      },
    }
  ];
  columnMode: ColumnMode = ColumnMode.force;
  selectionType: SelectionType = SelectionType.single;
  sortType = SortType.single;
  isFullScreen = false;
  rows: any[] = [];
  selectedItem: any = null;
  public attributeId: any;
  public domainAttributes: any = [];
  public defaultSorts: any;
  
  constructor(
    private businessRuleService: BusinessruleService,
    private route: Router,
    private appStoreService: AppDataService,
    private fb: FormBuilder,
    private datePipe: DatePipe,
    public dialog: MatDialog,
    private _snackBar: MatSnackBar,
    private messageservice: MessageService,
    private dialogRef: MatDialog,
    private errorPanelService: ErrorPanelService,
    private msgSrv: SnackBarService,
    private activeRoute: ActivatedRoute,
    private cdr: ChangeDetectorRef
  ) {
    this.entityId = +this.activeRoute?.snapshot?.queryParams?.['entity_id'];
    this.modelId = +this.activeRoute?.snapshot?.queryParams?.['model_id'];
    this.attributeId = this.activeRoute?.snapshot?.queryParams?.['attribute_id'];
    const { sort } = window.history.state;
    this.defaultSorts = !!sort ? JSON.parse(sort) : [];
    this.currentAttributeId = this.attributeId;
  }

  /**
   * Initialization tasks or data fetching can be done here
   */
  async ngOnInit() {
    this.loading = true;
    this.formbuild();

    // HANDLE SNACK BAR MESSAGES
    this.messageservice.snackMessage.subscribe((res: any) => {
      if (res) {
        this.errorPanelService.init();
        this.msgSrv.success(res);
      }
    });

    // HANDLE THIS FOR GET RULES AND MODELS APIS
    this.getRulesAndModelsData();
    this.handleRulesData();

    this.listForm.valueChanges.pipe(
      debounceTime(500)
    ).subscribe((item: any) => {
      this.filteredModels = this.filterItems(this.models, item.modelFilter);
      this.filteredEntites = this.filterItems(this.entities, item.entityFilter);
      this.filterAttributeSelection(item.attributeFilter);
    })
  }

  public async handleRulesData() {
    const { rules } = await this.getAllRulesApi();
    if (rules) {
      //     // Handling order by id
      rules.sort((a: any, b: any) => {
        return a.id - b.id;
      });
      this.dataSource = rules;
    }
  }

  // HANDLE FOR GETTING RULES AND MODEL DATA
  public async getRulesAndModelsData() {
    // eslint-disable-next-line prefer-const
    // const { rules } = await this.getAllRules();
    let { models } = await this.getALlApis();
    this.defaultModel = this.modelId ? this.modelId : models[0]?.id;
    this.handleEntityByModels(this.defaultModel);
    // if (rules) {
    //   // Handling order by id
    //   rules.sort((a: any, b: any) => {
    //     return a.id - b.id;
    //   });
    //   this.dataSource = rules;
    // }
    if (models) {

      this.models = models;
      this.filteredModels = models;
      this.filterData = this.dataSource;
      // this.currentDataSource =  this.dataSource;
      this.currentDataSource = this.rows.slice(
        this.pageIndex,
        this.pageIndex + this.pageSize
      );
      this.loading = false;
    } else {
      this.loading = false;
    }
  }

  /**
   * HANDLE FOR THIS FORM GROUP
   */
  public formbuild() {
    this.listForm = this.fb.group({
      model: new FormControl('', [Validators.required]),
      modelFilter: new FormControl(''),
      entity: new FormControl('', [Validators.required]),
      entityFilter: new FormControl(''),
      attrubute: new FormControl('', [Validators.required]),
      attributeFilter: new FormControl('')
    });
  }

  /**
 * HANDLE THIS FUNCTION FOR GET ALL THE RULES
 */
  public getAllRulesApi(): Promise<any> {
    return new Promise((resolve, rejects) => {
      this.businessRuleService.getAllRules().subscribe(
        (rules: any) => {
          resolve({
            rules,
          });
        },
        (err) => {
          this.loading = false;
          rejects({
            rules: [],
          });
        }
      );
    });
  }

  /**
   *  HANDLE THIS FUNCTION FOR GET APIS WITH COMBINE LATEST
   * @returns promise<any>
   */
  public async getALlApis(): Promise<any> {
    return new Promise((resolve, rejects) => {
      forkJoin([
        this.businessRuleService.getAllModles(),
      ]).subscribe(
        ([models]: any) => {
          resolve({
            models,
          });
        },
        (err) => {
          this.loading = false;
          rejects({
            models: [],
          });
        }
      );
    });
  }

  /**
   * HANDLE THIS FOR FILTER THE RULE DATA BY ATTRIBUTE ID
   * @param attributeId string
   */
  public handleFilterRuleByAttribute(attributeId: any, text?: any) {
    !!text ? this.dataGrid.defaultSorts = [] : '';
    this.currentAttributeId = attributeId;
    if (attributeId !== 'ALL') {
      let filteredRules = [];
      for (const rule of this.dataSource) {
        if (this.ruleContainsAttributeId(rule, attributeId) || this.actionContainsAttributeId(rule, attributeId) || this.elseActionContainsAttributeId(rule, attributeId)) {
          filteredRules.push(rule);
        }
      }
      this.rows = filteredRules;
      return
    }
    this.rows = this.currentDataSource;
  }

  /**
   * HANDLE THIS FOR FILTER THE CONDTIONS BY ATTRIBUTEID
   * @param rule any
   * @param id string
   * @returns 
   */
  ruleContainsAttributeId(rule: any, id: string): boolean {
    for (const condition of rule.condition) {
      if (condition.attributeId === id) {
        return true;
      }
    }
    return false;
  }

  /**
   * HANDLE THIS FOR FILTER THE IF ACTIONS BY ATTRIBUTEID
   * @param rule any
   * @param id string
   * @returns 
   */
  actionContainsAttributeId(rule: any, id: string): boolean {
    for (const action of rule.conditionalAction.ifActions) {
      if (action.attributeId === id) {
        return true;
      }
    }
    return false;
  }

  /**
   * HANDLE THIS FOR FILTER THE ELSE ACTIONS BY ATTRIBUTEID
   * @param rule any
   * @param id string
   * @returns 
   */
  elseActionContainsAttributeId(rule: any, id: string): boolean {
    for (const action of rule.conditionalAction.elseActions) {
      if (action.attributeId === id) {
        return true;
      }
    }
    return false;
  }

  /**
   * HANDLE FOR SHARE ENTITY ID WITH BEHAVIOUR SUBJECT
   */
  public addNewRule() {
    this.route.navigate([`/spriced-data-definition/rules/business-rule`], {
      queryParams: { model_id: this.modelId, entity_id: this.entityId},
      state: {sort: JSON.stringify(this.defaultSorts)}
    });
  }

  /**
   * HANDLING FOR UPDATE THE RULE DATA
   * @param event any
   * @param item any
   */
  public updateExcluded(event: any) {
    const excluded = event.value.checked;
    const param = {
      id: event.item.id,
      isExcluded: excluded,
    };
    let message: any = !event.item.isExcluded ? 'The rule is not going to be <strong>Excluded!</strong> Are you sure?' : 'Are you sure you want to <b>Exclude</b> the <b>rule?</b>'
    // OPEN DIALOG BOX
    const dialogRef = this.dialog.open(DialogboxComponent, {
      minWidth: '330px',
      maxWidth: '100%',
      width: 'auto',
      height: '140px',
      disableClose: true,
      data: {
        message: message,
        button: {
          confirmation: 'Yes',
          cancel: 'No',
        },
      },
    });

    // Handling for dialog confirmation
    dialogRef
      .afterClosed()
      .pipe(takeUntil(this.notifier$))
      .subscribe((result: any) => {
        if (result === true) {
          this.loading = true;
          this.businessRuleService
            .updateBusinessRule(event.item.id, param)
            .pipe(takeUntil(this.notifier$))
            .subscribe(
              (res: any) => {
                this.loading = false;
                this.errorPanelService.init();
                this.msgSrv.success('Excluded is updated successfully!');
                this.onRefresh();
              },
              (error: any) => {
                this.loading = false;
                console.log('Error occurred during API request:', error);
              }
            );
        } else {
          event.value.source.checked = !excluded;
        }
      });
  }

  /**
   *  HANDLE THIS FUNCTION FOR SORTING THE TABLE COLUMN
   * @param event any
   */
  public onSort(event: any)
  {
    this.defaultSorts = event.sorts[0];
    localStorage.setItem('sorts', JSON.stringify(this.defaultSorts));
  }

  /**
   * HANDLE FOR DELETE RULE BY ID
   * @param item any
   */
  public deleteRule(item: any) {
    // OPEN DIALOG BOX
    const dialogRef = this.dialog.open(DialogboxComponent, {
      minWidth: '330px',
      maxWidth: '100%',
      width: 'auto',
      height: '140px',
      data: {
        message: `Are you sure want to delete <strong>${item.name}</strong>?`,
        button: {
          confirmation: 'Delete',
          cancel: 'Cancel',
        },
      },
    });

    /**
     * Handling for dialog confirmation
     */
    dialogRef
      .afterClosed()
      .pipe(takeUntil(this.notifier$))
      .subscribe((result: any) => {
        if (result === true) {
          this.loading = true;
          this.businessRuleService
            .deleteBusinessRule(item.id)
            .pipe(takeUntil(this.notifier$))
            .subscribe(
              (res: any) => {
                this.paginator?.firstPage();
                // this._snackBar.open('Rule is deleted successfully!', 'close', {
                //   duration: 3000,
                // });
                this.errorPanelService.init();
                this.msgSrv.success('Rule is deleted successfully!');
                this.getRulesAndModelsData();
                this.onRefresh();
              },
              (error: any) => {
                this.loading = false;
                console.log('Error occurred during API request:', error);
              }
            );
        }
      });
  }

  // Generic filtering function
  filterItems(items: any[], searchText: string): any[] {
    return items.filter((item: any) => {
      return item.displayName
        .trim()
        .toLowerCase()
        .includes(searchText.trim().toLowerCase());
    });
  }

  filterAttributeSelection(text: string) {
    this.filteredAttributes = this.attributes.filter((item: any) => {
      return (
        item.displayName
          .trim()
          .toLowerCase()
          .indexOf(text?.trim().toLowerCase()) != -1
      );
    });
  }

  onItemSelected(e: any) {
    console.log(e);
    this.selectedItem = e;
  }

  /**
   * HANDLE THIS FUNCTION FOR EDIT THE LIST DATA
   * @param item any
   * @param text string
   */
  public async editBusinessRule(item: any, text?: string) {
    const routePath = text === 'preview' ? `${item.id}/preview` : item.id;
    this.route.navigate([`/spriced-data-definition/rules/business-rule/${routePath}`], {
       queryParams: { model_id: this.modelId, entity_id: this.entityId, attribute_id: this.currentAttributeId },
       state: {sort: JSON.stringify(this.defaultSorts)}
      });
  }
  /**
   * HANDLE FOR ENTITIES BY MODEL ID
   * @param id any
   */
  public handleEntityByModels(id: any, text?: any) {
    !!text ? this.dataGrid.defaultSorts = [] : '';
    this.businessRuleService
      .getAllEntitesByModuleId(id)
      .pipe(takeUntil(this.notifier$))
      .subscribe((res: any) => {
        this.entities = res;
        this.filteredEntites = res;
        const entity = res.find((el: any) => el.groupId === this.defaultModel)
        this.defaultEntity = this.entityId && !text ? this.entityId : entity?.id;
        this.modelId = id;
        this.handleAttributeByEntity(this.defaultEntity);
      });
  }


  /**
   * HANDLE FOR ATTRIBUTES BY ENTITY ID
   * @param id number
   */
  public async handleAttributeByEntity(id: any, text?: any) {
    !!text ? this.dataGrid.defaultSorts = [] : '';
    this.entityId = id;
    this.loading = true;
    if (id) {
      const entity = this.entities.find((item: any) => item.id == id);
      this.attributes = [];
      const attributeList = entity.attributes.filter((el: any) => !el.systemAttribute);
      this.domainAttributes = attributeList;
      const relatedRefreneceTableEntity = entity.attributes.filter((el: any) => !!el.referencedTableId);
      // Handle for nested attribute
      if (relatedRefreneceTableEntity && relatedRefreneceTableEntity.length > 0) {
        // Use Promise.all to wait for all promises to resolve
        await Promise.all(
           relatedRefreneceTableEntity.map(async (el: any) => {
            const { entityData } = await this.getEntityById(el.referencedTableId);
            const attributes = entityData?.attributes.filter((el: any) => !el.systemAttribute);
            const nestedProcessedAttributes = this.processNestedAttributes(attributes, el);
            this.domainAttributes.push(...nestedProcessedAttributes);
          })
        )
      }
      this.attributes = [
        {
          displayName: 'All',
          name: 'All',
          id: 'ALL',
        },
        ...this.domainAttributes,
      ];
      this.filteredAttributes = this.attributes;
      this.defaultAttribute = this.attributeId ? this.attributeId : 'ALL';
      // this.attributes = entity.attributes;
      this.filterData = this.dataSource.filter((res: any) => res.entityId === id);
      this.rows = this.filterData;
      this.currentDataSource = this.filterData.slice(
        this.pageIndex,
        this.pageIndex + this.pageSize
      );
      this.paginator?.firstPage();
      this.loading = false;
    } else {
      this.rows = [];
      this.filterData = [];
      this.attributes = [];
      this.loading = false;
    }
  }

  /**
   * HANDLE THIS FUNCTION FOR GET ENTITY BY IDS
   * @param entityId number
   * @returns 
   */
  public getEntityById(entityId: number, retryCount = 3): Promise<any> {
    return new Promise((resolve, reject) => {
        const fetchData = () => {
            this.businessRuleService.getAllEntitesById(entityId).subscribe(
                (entityData: any) => {
                    resolve({ entityData });
                },
                (err) => {
                    if (retryCount > 0) {
                        fetchData();
                        retryCount--;
                    } else {
                        reject({ entityData: [] });
                    }
                }
            );
        };
        fetchData(); 
    });
  }


  /**
  * HANDLE THIS FUNCTION FOR EDIT THE NESTEDATTRIBUTES
  * @param nestedAttributes any
  * @param parentAttribute string
  * @returns 
  */
  public processNestedAttributes(nestedAttributes: any, parentAttribute: any) {
    const processedAttributes: any = [];
    if (nestedAttributes) {
      nestedAttributes.forEach((el: any) => {
        const processedAttribute = {
          ...el,
          displayName: `${parentAttribute?.displayName}.${el.displayName}`,
          name: `${parentAttribute?.displayName}.${el.displayName}`
        };
        processedAttributes.push(processedAttribute);
      });
    }

    return processedAttributes;
  }

  /**
   * HANDLING FOR CHANGE PAGE
   * @param event any
   */
  public onPageChange(event: any) {

    const index = event.pageIndex * event.pageSize;
    this.currentDataSource = this.filterData.slice(
      index,
      index + event.pageSize
    );
  }

  /**
     * HANDLE THIS FUNCTION FOR EXPRESSION TOOLTIP
     * @param element any
     * @returns
     */
  getExpressionTooltip(element: any): string {
    let tooltipText = `${this.getConditionTooltipText(element.condition, 3)}`;
    tooltipText += this.getActionTooltipText(element.conditionalAction);
    this.cdr.detectChanges();
    return tooltipText;
  }

  /**
   * HANDLE THIS FUNCTION FOR HIERARCHICAL ADD CONDITIONS
   * @param conditions any
   * @param depth number
   * @returns
   */
  private getConditionTooltipText(conditions: any[], depth: number): string {
    let tooltipConditionText = `<b>IF</b><br>`;
    tooltipConditionText += this.getIndent(depth);
    let operand: any = "";

    if (conditions && conditions.length > 0) {
      conditions.forEach((condition: any, index: number) => {
        tooltipConditionText += index !== 0 ? this.getIndent(3) : "";
        let attribute = this.attributes.find(
          (item: any) => item.id === condition.attributeId
        );
        attribute = !!attribute ? attribute : {name: 'code', displayName: 'Code', id: '1234'};
        if (attribute && attribute.name.includes('_') || condition?.operatorType.includes('_')) {
          attribute.name = attribute?.name.replace(/_/g, ' ');
          condition.operatorType = condition?.operatorType.replace(/_/g, ' ');
        }
        const conditionType =
          condition?.conditionType !== "NONE" ? condition?.conditionType : "";
        const subConditionType =
          condition?.subConditionType !== "NONE"
            ? condition?.subConditionType
            : "";
        if (condition.operandType === "ATTRIBUTE") {
          operand = this.attributes.find(
            (item: any) => item.id === condition.operand
          );
          operand = operand?.name;
        } else if (
          ["DATE", "TIME_STAMP", "DATE_TIME"].includes(attribute?.dataType) && condition.operandType === 'CONSTANT' && condition?.operand !== '' && !!condition?.operand
        ) {
          const dateTimes = condition?.operand.split(","); // Split the input string by commas

          const formattedDates = dateTimes.map((dateTime: any) =>
            moment.utc(dateTime).format("YYYY/MM/DD")
          );
          const joinedString = formattedDates.join(" & ");
          const finalArray = [`${joinedString}`];
          operand = finalArray;
        }
        else {
          operand = condition?.operand;
        }
        operand = !!condition?.operand && condition?.operand !== "" ? `to ${operand}` : '';

        tooltipConditionText += `${conditionType} ${attribute?.name.toLowerCase()}  
        ${condition?.operatorType.toLowerCase()} ${operand}`;

        if (condition.subConditions && condition.subConditions.length > 0) {
          tooltipConditionText += ` ${subConditionType} (`;
          tooltipConditionText += this.getSubConditionText(
            condition.subConditions,
            1
          );
          tooltipConditionText += ")";
        }
        tooltipConditionText += "<br>";
      });
    }
    return tooltipConditionText.trim();
  }

  /**
   * HANDLE THIS FUNCTION FOR HIERARCHICAL ADD SUBCONDITIONS
   * @param subConditions any
   * @param depth number
   * @returns
   */
  private getSubConditionText(subConditions: any[], depth: number): string {
    let subConditionText = "";
    let operand: any = "";

    if (subConditions && subConditions.length > 0) {
      subConditions.forEach((condition: any, index: number) => {
        subConditionText += index !== 0 ? this.getIndent(1) : "";
        let attribute = this.attributes.find(
          (item: any) => item.id === condition.attributeId
        );
        attribute = !!attribute ? attribute : {name: 'code', displayName: 'Code', id: '1234'};
        if (attribute && attribute.name.includes('_') || condition.operatorType.includes('_')) {
          attribute.name = attribute?.name.replace(/_/g, ' ');
          condition.operatorType = condition?.operatorType.replace(/_/g, ' ');
        }
        const conditionType =
          condition?.conditionType !== "NONE" ? condition?.conditionType : "";
        const subConditionType =
          condition?.subConditionType !== "NONE"
            ? condition?.subConditionType
            : "";
        if (condition.operandType === "ATTRIBUTE") {
          operand = this.attributes.find(
            (item: any) => item.id === condition.operand
          );
          operand = operand?.name;
        } else if (
          ["DATE", "TIME_STAMP", "DATE_TIME"].includes(attribute?.dataType) && condition.operandType === 'CONSTANT' && condition?.operand !== '' && !!condition?.operand
        ) {
          const dateTimes = condition?.operand.split(","); // Split the input string by commas

          const formattedDates = dateTimes.map((dateTime: any) =>
            moment.utc(dateTime).format("YYYY/MM/DD")
          );
          const joinedString = formattedDates.join(" & ");
          const finalArray = [`${joinedString}`];
          operand = finalArray;
        }
        else {
          operand = condition?.operand;
        }
        operand = !!condition?.operand && condition?.operand !== "" ? `to ${operand}` : '';

        subConditionText += `${conditionType} ${attribute.name
          } ${condition?.operatorType.toLowerCase()} ${operand}`;
        if (condition.subConditions && condition.subConditions.length > 0) {
          subConditionText += ` ${subConditionType} (`;
          subConditionText += this.getSubConditionText(
            condition.subConditions,
            2
          );
          subConditionText += ")";
        }
      });
    }
    return subConditionText;
  }

  /**
   * HANDLE THIS FUNCTION FOR ADD ACTIONS
   * @param action any
   * @returns
   */
  public getActionTooltipText(action: any): string {
    let tooltipActionText = "";

    if (action) {
      if (action.ifActions && action.ifActions.length > 0) {
        tooltipActionText += `${this.getActionConditionsText(
          action.ifActions,
          3,
          "THEN"
        )}<br>`;
      }

      if (action.elseActions && action.elseActions.length > 0) {
        tooltipActionText += this.getActionConditionsText(
          action.elseActions,
          3,
          "ELSE"
        );
      }
    }

    return tooltipActionText;
  }

  /**
   * HANDLE THIS FUNCTION FOR ADD IFACTION AND ELSEACTION DATA
   * @param actions any
   * @param depth number
   * @returns
   */
  public getActionConditionsText(
    actions: any[],
    depth: number,
    type: any
  ): string {
    let tooltipActionConditionsText = `<b>${type}</b><br>`;
    tooltipActionConditionsText += this.getIndent(depth);
    let operand: any = '';

    if (actions && actions.length > 0) {
      actions.forEach((action: any, index: number) => {
        tooltipActionConditionsText += index !== 0 ? this.getIndent(3) : "";
        operand = action?.operand !== "" ? action?.operand : "Blank";
        let attribute = this.attributes.find(
          (item: any) => item.id === action.attributeId
        );
        attribute = !!attribute ? attribute : {name: 'code', displayName: 'Code', id: '1234'};
        if (attribute && attribute.name.includes('_') || action.actionType.includes('_')) {
          attribute.name = attribute?.name.replace(/_/g, ' ');
          action.actionType = action?.actionType.replace(/_/g, ' ')
        }
        if (action.operandType === "ATTRIBUTE") {
          operand = this.attributes.find(
            (item: any) => item.id === action.operand
          );
          operand = operand?.name;
        }
        else if (
          ["DATE", "TIME_STAMP", "DATE_TIME"].includes(attribute?.dataType) && action?.operandType === 'CONSTANT' && action?.operand !== '' && !!action?.operand
        ) {
          const dateTimes = action?.operand.split(","); // Split the input string by commas

          const formattedDates = dateTimes.map((dateTime: any) =>
            moment.utc(dateTime).format("YYYY/MM/DD")
          );
          const joinedString = formattedDates.join(" & ");
          const finalArray = [`${joinedString}`];
          operand = finalArray;
        }
        else {
          operand = action?.operand;
        }
        if (action.actionType.toLowerCase().trim().endsWith('to')) {
          const lastindex = action.actionType.toLowerCase().lastIndexOf('to');
          if (
            (lastindex > -1) && (lastindex === 0 || action.actionType[lastindex - 1] === ' ')
          ) {
            action.actionType = action.actionType.substring(0, lastindex)
          }
        };
        operand = !!action?.operand && action?.operand !== "" ? `to ${operand}` : !['IS REQUIRED', 'IS NOT VALID'].includes(action?.actionType) ? ` " "` : '';
        tooltipActionConditionsText += `${attribute.name
          } ${action.actionType.toLowerCase()} ${operand}`;
        const lastAction = actions.length - 1;
        lastAction != index ? (tooltipActionConditionsText += "<br>") : "";
      });
    }

    return tooltipActionConditionsText;
  }

  /**
   * USE THIS FOR ADD EXTRA SPACES
   * @param depth number
   * @returns
   */
  private getIndent(depth: number): string {
    return "&nbsp;".repeat(depth); // You can adjust the number of spaces for indentation
  }

  private getData(pageSize: number, pageNumber: number) {
    const startIndex = pageNumber * pageSize;
    const endIndex = startIndex + pageSize;
    return this.dataSource.filter((item: any, index: number) => {
      return index >= startIndex && index < endIndex;
    });
  }

  onPaginate(e: Paginate) {
    const data = this.getData(e.limit, e.offset);
    this.filterData = data.filter((res: any) => res.entityId === this.entityId);
    this.rows = this.filterData;
  }

  /**
   * HANDLE THIS FOR REFRESH THE TABLE
   */
  onRefresh() {
    this.handleRulesData();
    this.getRulesAndModelsData();
    this.selectedItem = null;
    this.dataGrid.clearSelection();
  }

  /**
   *  The ngOnDestroy lifecycle hook in Angular is used to perform cleanup tasks when a component is about to be destroyed.
     It is called just before the component is removed from the DOM.
   */
  ngOnDestroy() {
    this.notifier$.next(true);
    this.notifier$.complete();
  }
}
