import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit, Output, OnDestroy, ViewChild } from '@angular/core';
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
  public defValue: any;
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
    { column: "priority", name: "Priority", canAutoResize: true, isSortable: true, width: 100 },
    { column: "excluded", name: "Excluded", canAutoResize: true, isSortable: true, width: 100 },
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
      width: 100
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
      name: "Updated Date",
      canAutoResize: true,
      isSortable: true,
      width: 150
    },
    // {
    //   column: "action",
    //   name: "Action",
    //   canAutoResize: true,
    //   isSortable: true,
    //   width:100
    // },
  ];
  columnMode: ColumnMode = ColumnMode.force;
  selectionType: SelectionType = SelectionType.single;
  sortType = SortType.single;
  isFullScreen = false;
  rows: any[] = [];
  selectedItem: any = null;

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
  ) {
    this.entityId = +this.activeRoute?.snapshot?.queryParams?.['entity_id'];
    this.modelId = +this.activeRoute?.snapshot?.queryParams?.['model_id'];
  }

  /**
   * Initialization tasks or data fetching can be done here
   */
  async ngOnInit() {
    
    // const user = localStorage.getItem('user')
    //   ? JSON.parse(localStorage.getItem('user')!)
    //   : null;
    this.loading = true;
    this.formbuild();

    // HANDLE SNACK BAR MESSAGES
    this.messageservice.snackMessage.subscribe((res: any) => {
      if (res) {
        this.errorPanelService.init();
        this.msgSrv.success(res);
      }
    });

    // const param = {
    //   userLoggedIn: user.userLoggedIn,
    //   appName: 'Data-Defination',
    // };
    // this.appStoreService.appStore.next(param);

    // HANDLE THIS FOR GET RULES AND MODELS APIS
    this.getRulesAndModelsData();
  }

  // HANDLE FOR GETTING RULES AND MODEL DATA
  public async getRulesAndModelsData() {
    // eslint-disable-next-line prefer-const
    let { rules, models } = await this.getALlApis();
    this.defaultModel = this.modelId ? this.modelId : models[0]?.id;
    this.handleEntityByModels(this.defaultModel);

    if (rules && models) {
      // Handling order by id
      rules.sort((a: any, b: any) => {
        return a.id - b.id;
      });

      rules = rules.map((item: any) => ({
        ...item,
        updatedDate: this.datePipe.transform(
          item.updatedDate,
          'MM/dd/yyyy hh:mm:ss a'
        ),
      }));
      this.models = models;
      this.dataSource = rules;
      this.rows = rules;
      this.filterData = this.rows;
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
      model: new FormControl(this.defaultModel, [Validators.required]),
      entity: new FormControl(this.defaultEntity, [Validators.required]),
      attrubute: new FormControl('', [Validators.required]),
    });
  }

  /**
   *  HANDLE THIS FUNCTION FOR GET APIS WITH COMBINE LATEST
   * @returns promise<any>
   */
  public async getALlApis(): Promise<any> {
    return new Promise((resolve, rejects) => {
      forkJoin([
        this.businessRuleService.getAllRules(),
        this.businessRuleService.getAllModles(),
      ]).subscribe(
        ([rules, models]: any) => {
          resolve({
            rules,
            models,
          });
        },
        (err) => {
          this.loading = false;
          rejects({
            rules: [],
            models: [],
          });
        }
      );
    });
  }

  /**
   * HANDLE FOR SHARE ENTITY ID WITH BEHAVIOUR SUBJECT
   */
  public addNewRule() {
    this.route.navigate([`/spriced-data-definition/rules/business-rule`], {
      queryParams: { model_id: this.modelId, entity_id: this.entityId },
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
    let message: any = !event.item.isExcluded ? 'The rule is not going to be <strong>Exclude!</strong> Are you sure?' : 'Are you sure you want to <b>Exclude</b> the <b>rule?</b>'
    // OPEN DIALOG BOX
    const dialogRef = this.dialog.open(DialogboxComponent, {
      minWidth: '330px',
      maxWidth: '100%',
      width: 'auto',
      height: '140px',
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
          (event.item.status === 'Active' ? this.businessRuleService
            .updateBusinessRule(event.item.id, param) : this.businessRuleService.updateSaveBusinessRule(event.item.id, param))
            .pipe(takeUntil(this.notifier$))
            .subscribe(
              (res: any) => {
                this.loading = false;
                this.errorPanelService.init();
                this.msgSrv.success('Excluded is updated successfully!');
                // this._snackBar.open(
                //   'Excluded is updated successfully!',
                //   'close',
                //   {
                //     duration: 3000,
                //   }
                // );
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
              },
              (error: any) => {
                this.loading = false;
                console.log('Error occurred during API request:', error);
              }
            );
        }
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
    this.route.navigate([
      `/spriced-data-definition/rules/business-rule/${routePath}`,
    ]);
  }
  /**
   * HANDLE FOR ENTITIES BY MODEL ID
   * @param id number
   */
  public handleEntityByModels(id: number, text?: any) {
    this.businessRuleService
      .getAllEntitesByModuleId(id)
      .pipe(takeUntil(this.notifier$))
      .subscribe((res: any) => {
        this.entities = res;
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
  public handleAttributeByEntity(id: number) {
    
    this.entityId = id;
    this.loading = true;
    const entity = this.entities.find((item: any) => item.id == id);
    this.attributes = [];
    this.attributes = [
      {
        name: 'All',
        id: 'ALL',
      },
      ...entity.attributes,
    ];
    this.defValue = 'ALL';

    // this.attributes = entity.attributes;

    this.filterData = this.dataSource.filter((res: any) => res.entityId === id);
    this.rows = this.filterData;
    this.currentDataSource = this.filterData.slice(
      this.pageIndex,
      this.pageIndex + this.pageSize
    );
    this.paginator?.firstPage();
    this.loading = false;
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
    let operand: any = '';

    if (conditions && conditions.length > 0) {
      conditions.forEach((condition: any, index: number) => {
        tooltipConditionText += index !== 0 ? this.getIndent(3) : '';
        const attribute = this.attributes.find((item: any) => item.id === condition.attributeId);
        const conditionType = condition?.conditionType !== 'NONE' ? condition?.conditionType : '';
        const subConditionType = condition?.subConditionType !== 'NONE' ? condition?.subConditionType : '';
        if (condition.operandType === 'ATTRIBUTE') {
          operand = this.attributes.find((item: any) => item.id === condition.operand);
          operand = operand?.name;
        }
        else if (['DATE', 'TIME_STAMP', 'DATE_TIME'].includes(attribute.dataType)) {
          const dateTimes = condition?.operand.split(','); // Split the input string by commas

          const formattedDates = dateTimes.map((dateTime: any) => moment.utc(dateTime).format('YYYY/MM/DD'));
          const joinedString = formattedDates.join(" & ");
          const finalArray = [`${joinedString}`];
          operand = finalArray;
        }
        else {
          operand = condition?.operand !== '' ? condition?.operand : condition?.operandType.toLowerCase();
        }
        tooltipConditionText += `${conditionType} ${attribute.name} ${condition?.operatorType.toLowerCase()} to ${operand}`;
        if (condition.subConditions && condition.subConditions.length > 0) {
          tooltipConditionText += ` ${subConditionType} (`;
          tooltipConditionText += this.getSubConditionText(condition.subConditions, 1);
          tooltipConditionText += ')';
        }
        tooltipConditionText += '<br>';
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
    let subConditionText = '';
    let operand: any = '';

    if (subConditions && subConditions.length > 0) {
      subConditions.forEach((condition: any, index: number) => {
        subConditionText += index !== 0 ? this.getIndent(1) : '';
        const attribute = this.attributes.find((item: any) => item.id === condition.attributeId);
        const conditionType = condition?.conditionType !== 'NONE' ? condition?.conditionType : '';
        const subConditionType = condition?.subConditionType !== 'NONE' ? condition?.subConditionType : '';
        if (condition.operandType === 'ATTRIBUTE') {
          operand = this.attributes.find((item: any) => item.id === condition.operand);
          operand = operand?.name;
        }
        else {
          operand = condition?.operand !== '' ? condition?.operand : condition?.operandType.toLowerCase(1);
        }

        subConditionText += `${conditionType} ${attribute.name} ${condition?.operatorType.toLowerCase()} to ${operand}`;
        if (condition.subConditions && condition.subConditions.length > 0) {
          subConditionText += ` ${subConditionType} (`;
          subConditionText += this.getSubConditionText(condition.subConditions, 2);
          subConditionText += ')';
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
    let tooltipActionText = '';

    if (action) {

      if (action.ifActions && action.ifActions.length > 0) {
        tooltipActionText += `${this.getActionConditionsText(action.ifActions, 3, 'ELSE')}<br>`;
      }

      if (action.elseActions && action.elseActions.length > 0) {
        tooltipActionText += this.getActionConditionsText(action.elseActions, 3, 'THEN');
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
  public getActionConditionsText(actions: any[], depth: number, type: any): string {
    let tooltipActionConditionsText = `<b>${type}</b><br>`;
    tooltipActionConditionsText += this.getIndent(depth);

    if (actions && actions.length > 0) {
      actions.forEach((action: any, index: number) => {
        tooltipActionConditionsText += index !== 0 ? this.getIndent(3) : '';
        const operand = action?.operand !== '' ? action?.operand : 'Blank';
        const attribute = this.attributes.find((item: any) => item.id === action.attributeId);
        tooltipActionConditionsText += `${attribute.name} ${action.actionType.toLowerCase()} to ${operand}`;
        const lastAction = actions.length - 1;
        lastAction != index ? tooltipActionConditionsText += '<br>' : '';
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
    return '&nbsp;'.repeat(depth); // You can adjust the number of spaces for indentation
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
