import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  AppForm,
  DataGridComponent,
  DialogService,
  DialogueModule,
  DynamicFormModule,
  FORM_DATA_SERVICE,
  FormFieldControls,
  FormFieldGroup,
  Header,
  HeaderActionComponent,
  Paginate,
  SnackBarService,
  SnackbarModule,
  TopMenuComponent,
  TwoColThreeForthComponent,
} from '@spriced-frontend/spriced-ui-lib';
import { ColumnMode, SelectionType, SortType } from '@swimlane/ngx-datatable';
import { MatButtonModule } from '@angular/material/button';
import { FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'sp-home',
  standalone: true,
  imports: [
    CommonModule,
    DataGridComponent,
    HeaderActionComponent,
    TwoColThreeForthComponent,
    MatButtonModule,
    SnackbarModule,
    DialogueModule,
    DynamicFormModule,
    TopMenuComponent
  ],
  providers: [{ provide: FORM_DATA_SERVICE, useValue: null }],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  //changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent implements OnInit {
  headers: Header[] = [];
  columnMode: ColumnMode = ColumnMode.force;
  selectionType: SelectionType = SelectionType.single;
  sortType = SortType.single;
  isFullScreen = false;
  totalElements = 10000;
  rows: any[] = [];
  data: any[] = [];

  //Dynamic UI
  private formFields!: FormFieldControls;
  formFieldGroups!: FormFieldGroup;
  roles: string[] = [];
  appForm!: AppForm;
  form: FormGroup = new FormGroup({});

  ngOnInit(): void {
    setTimeout(() => {
      this.formFields = [
        {
          type: 'input',
          subType: 'text',
          name: 'firstName',
          value: 'IVAN',
          placeholder: 'First name',
          hint: 'User first name.',
          icon: 'phone',
          label: 'First Name',
          style: {
            colSpan: 2,
          },
          validations: [
            {
              name: 'required',
              message: 'First name required',
              validator: Validators.required,
            },
            {
              name: 'minlength',
              message: 'Min length should be 3.',
              validator: Validators.minLength(3),
            },
          ],
          accessControl: {
            disabled: ['admin'],
            hidden: [],
          },
        },
        {
          type: 'input',
          subType: 'text',
          name: 'lastName',
          value: 'IVAN',
          placeholder: 'First name',
          hint: 'User first name.',
          icon: 'phone',
          label: 'First Name',
          style: {
            colSpan: 2,
          },
          validations: [
            {
              name: 'required',
              message: 'First name required',
              validator: Validators.required,
            },
            {
              name: 'minlength',
              message: 'Min length should be 3.',
              validator: Validators.minLength(3),
            },
          ],
          accessControl: {
            disabled: ['admin'],
            hidden: [],
          },
        },
        {
          type: 'input',
          subType: 'text',
          name: 'fullName',
          value: 'IVAN',
          placeholder: 'First name',
          hint: 'User first name.',
          icon: 'phone',
          label: 'First Name',
          style: {
            colSpan: 2,
          },
          validations: [
            {
              name: 'required',
              message: 'First name required',
              validator: Validators.required,
            },
            {
              name: 'minlength',
              message: 'Min length should be 3.',
              validator: Validators.minLength(3),
            },
          ],
          accessControl: {
            disabled: ['admin'],
            hidden: [],
          },
        },
        {
          type: 'input',
          subType: 'text',
          name: 'fullName',
          value: 'IVAN',
          placeholder: 'First name',
          hint: 'User first name.',
          icon: 'phone',
          label: 'First Name',
          style: {
            colSpan: 2,
          },
          validations: [
            {
              name: 'required',
              message: 'First name required',
              validator: Validators.required,
            },
            {
              name: 'minlength',
              message: 'Min length should be 3.',
              validator: Validators.minLength(3),
            },
          ],
          accessControl: {
            disabled: ['admin'],
            hidden: [],
          },
        },
        {
          type: 'input',
          subType: 'text',
          name: 'newName',
          value: 'IVAN',
          placeholder: 'First name',
          hint: 'User first name.',
          icon: 'phone',
          label: 'First Name',
          style: {
            colSpan: 2,
          },
          validations: [
            {
              name: 'required',
              message: 'First name required',
              validator: Validators.required,
            },
            {
              name: 'minlength',
              message: 'Min length should be 3.',
              validator: Validators.minLength(3),
            },
          ],
          accessControl: {
            disabled: ['admin'],
            hidden: [],
          },
        },
        {
          type: 'input',
          subType: 'text',
          name: 'newName1',
          value: 'IVAN',
          placeholder: 'First name',
          hint: 'User first name.',
          icon: 'phone',
          label: 'First Name',
          style: {
            colSpan: 2,
          },
          validations: [
            {
              name: 'required',
              message: 'First name required',
              validator: Validators.required,
            },
            {
              name: 'minlength',
              message: 'Min length should be 3.',
              validator: Validators.minLength(3),
            },
          ],
          accessControl: {
            disabled: ['admin'],
            hidden: [],
          },
        },
        {
          type: 'input',
          subType: 'text',
          name: 'newName2',
          value: 'IVAN',
          placeholder: 'First name',
          hint: 'User first name.',
          icon: 'phone',
          label: 'First Name',
          style: {
            colSpan: 2,
          },
          validations: [
            {
              name: 'required',
              message: 'First name required',
              validator: Validators.required,
            },
            {
              name: 'minlength',
              message: 'Min length should be 3.',
              validator: Validators.minLength(3),
            },
          ],
          accessControl: {
            disabled: ['admin'],
            hidden: [],
          },
        },
        {
          type: 'input',
          subType: 'text',
          name: 'newName3',
          value: 'IVAN',
          placeholder: 'First name',
          hint: 'User first name.',
          icon: 'phone',
          label: 'First Name',
          style: {
            colSpan: 2,
          },
          validations: [
            {
              name: 'required',
              message: 'First name required',
              validator: Validators.required,
            },
            {
              name: 'minlength',
              message: 'Min length should be 3.',
              validator: Validators.minLength(3),
            },
          ],
          accessControl: {
            disabled: ['admin'],
            hidden: [],
          },
        },
        {
          type: 'input',
          subType: 'text',
          name: 'newName4',
          value: 'IVAN',
          placeholder: 'First name',
          hint: 'User first name.',
          icon: 'phone',
          label: 'First Name',
          style: {
            colSpan: 2,
          },
          validations: [
            {
              name: 'required',
              message: 'First name required',
              validator: Validators.required,
            },
            {
              name: 'minlength',
              message: 'Min length should be 3.',
              validator: Validators.minLength(3),
            },
          ],
          accessControl: {
            disabled: ['admin'],
            hidden: [],
          },
        },
        {
          type: 'input',
          subType: 'text',
          name: 'newName5',
          value: 'IVAN',
          placeholder: 'First name',
          hint: 'User first name.',
          icon: 'phone',
          label: 'First Name',
          style: {
            colSpan: 2,
          },
          validations: [
            {
              name: 'required',
              message: 'First name required',
              validator: Validators.required,
            },
            {
              name: 'minlength',
              message: 'Min length should be 3.',
              validator: Validators.minLength(3),
            },
          ],
          accessControl: {
            disabled: ['admin'],
            hidden: [],
          },
        },
        {
          type: 'numeric',
          subType: 'text',
          name: 'Number',
          value: 1,
          placeholder: 'Number',
          hint: 'User first name.',
          icon: 'phone',
          label: 'Number',
          style: {
            colSpan: 2,
          },
          validations: [
            {
              name: 'required',
              message: 'Number required',
              validator: Validators.required,
            },
            {
              name: 'minlength',
              message: 'Min length should be 3.',
              validator: Validators.minLength(3),
            },
          ],
          accessControl: {
            disabled: ['admin'],
            hidden: [],
          },
        },
      ];
      this.appForm = {
        title: 'Dynamic Form',
        columns: 4,
        groups: [
          {
            title: '',
            formFieldControls: [...this.formFields],
          },
        ],
        asyncValidations: [],
        validations: [],
      };

      this.roles = ['admin', 'editor'];
    }, 500);
  }
  //Dynamic UI

  @ViewChild(DataGridComponent)
  dataGrid!: DataGridComponent;

  constructor(
    private snackbarService: SnackBarService,
    private dialogService: DialogService
  ) {
    this.headers = Array.from(Array(150).keys()).map((item) => {
      return {
        name: 'column' + item,
        column: 'column' + item,
        hidden: false,
        //pinned: 'left',
        width: 200,
      };
    });

    this.data = Array.from(Array(10000).keys()).map((rowItem) => {
      const colRows = Array.from(Array(150).keys()).map((item) => {
        return rowItem + 'value';
      });
      return colRows;
    });

    this.rows = this.data; //this.getData(10, 0);
  }

  private getData(pageSize: number, pageNumber: number) {
    const startIndex = pageNumber * pageSize;
    const endIndex = startIndex + pageSize;
    return this.data.filter((item, index) => {
      return index >= startIndex && index < endIndex;
    });
  }

  onAddRule() {
    alert('AddRule');
  }

  onAddRecord() {
    this.dataGrid.clearSelection();
    alert('AddRecord');
  }

  onPaginate(e: Paginate) {
    this.rows = this.getData(e.limit, e.offset);
  }

  onItemSelected(e: any) {
    console.log(e);
  }

  onSort(e: any) {
    console.log(e);
  }

  onClick() {
    this.snackbarService.success('message');
  }

  onErrorClick() {
    this.snackbarService.error(
      'This message is to show error message for upload'
    );
  }

  onWarnClick() {
    this.snackbarService.warn(
      'This message is to show warn message for upload'
    );
  }

  onNotificationClick() {
    this.snackbarService.notification(
      'This message is to show notification message for upload'
    );
  }

  onFullScreen() {
    this.isFullScreen = !this.isFullScreen;
  }

  onConfirmClick() {
    const dialogResult = this.dialogService.openConfirmDialoge({
      title: 'Confirm',
      icon: 'public',
      message:
        'Do you want to delete, there are lot of things to be checked before it?',
      maxWidth: 400,
    });

    dialogResult.afterClosed().subscribe((val) => {
      console.log(val);
    });
  }

  onInfoClick() {
    const dialogResult = this.dialogService.openInfoDialog({
      title: 'Confirm',
      icon: 'public',
      yes: 'Info',
      message:
        'Do you want to delete, there are lot of things to be checked before it?',
      maxWidth: 400,
    });

    dialogResult.afterClosed().subscribe((val) => {
      console.log(val);
    });
  }
}
