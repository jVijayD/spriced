import { Component, OnInit, ViewChild } from "@angular/core";
import { CommonModule } from "@angular/common";
import {
  AppForm,
  DataGridComponent,
  DialogService,
  DialogueModule,
  DynamicFormModule,
  DynamicFormService,
  EventElement,
  FORM_DATA_SERVICE,
  FormFieldControls,
  FormFieldGroup,
  Header,
  HeaderActionComponent,
  Paginate,
  SnackBarService,
  SnackbarModule,
  TwoColThreeForthComponent,
} from "@spriced-frontend/spriced-ui-lib";
import { ColumnMode, SelectionType, SortType } from "@swimlane/ngx-datatable";
import { MatButtonModule } from "@angular/material/button";
import { FormGroup, Validators } from "@angular/forms";
import { of } from "rxjs";

@Component({
  selector: "sp-home",
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
  ],
  providers: [
    {
      provide: FORM_DATA_SERVICE,
      useValue: {
        getMembers: () => {
          return of([10, 20, 30, 40, 50]);
        },
        getCountries: () => {
          return of([
            {
              name: "England",
              id: 4,
              countryCode: "+95",
            },
          ]);
        },
      },
    },
    DynamicFormService,
  ],
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.scss"],
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
          type: "input",
          subType: "text",
          name: "firstName",
          value: "IVAN",
          visible: false,
          placeholder: "First name",
          hint: "User first name.",
          icon: "phone",
          label: "First Name",
          style: {
            colSpan: 2,
          },
          validations: [
            {
              name: "required",
              message: "First name required",
              validator: Validators.required,
            },
            {
              name: "minlength",
              message: "Min length should be 3.",
              validator: Validators.minLength(3),
            },
          ],
          accessControl: {
            disabled: ["admin"],
            hidden: [],
          },
        },
        {
          type: "input",
          subType: "text",
          name: "lastName",
          value: "IVAN",
          visible: false,
          placeholder: "First name",
          hint: "User first name.",
          icon: "phone",
          label: "First Name",
          style: {
            colSpan: 2,
          },
          validations: [
            {
              name: "required",
              message: "First name required",
              validator: Validators.required,
            },
            {
              name: "minlength",
              message: "Min length should be 3.",
              validator: Validators.minLength(3),
            },
          ],
          accessControl: {
            disabled: ["admin"],
            hidden: [],
          },
        },
        {
          type: "input",
          subType: "text",
          name: "fullName",
          value: "IVAN",
          visible: false,
          placeholder: "First name",
          hint: "User first name.",
          icon: "phone",
          label: "First Name",
          style: {
            colSpan: 2,
          },
          validations: [
            {
              name: "required",
              message: "First name required",
              validator: Validators.required,
            },
            {
              name: "minlength",
              message: "Min length should be 3.",
              validator: Validators.minLength(3),
            },
          ],
          accessControl: {
            disabled: ["admin"],
            hidden: [],
          },
        },
        {
          type: "input",
          subType: "text",
          name: "fullName",
          value: "IVAN",
          visible: false,
          placeholder: "First name",
          hint: "User first name.",
          icon: "phone",
          label: "First Name",
          style: {
            colSpan: 2,
          },
          validations: [
            {
              name: "required",
              message: "First name required",
              validator: Validators.required,
            },
            {
              name: "minlength",
              message: "Min length should be 3.",
              validator: Validators.minLength(3),
            },
          ],
          accessControl: {
            disabled: ["admin"],
            hidden: [],
          },
        },
        {
          type: "input",
          subType: "text",
          name: "newName",
          value: "IVAN",
          visible: false,
          placeholder: "First name",
          hint: "User first name.",
          icon: "phone",
          label: "First Name",
          style: {
            colSpan: 2,
          },
          validations: [
            {
              name: "required",
              message: "First name required",
              validator: Validators.required,
            },
            {
              name: "minlength",
              message: "Min length should be 3.",
              validator: Validators.minLength(3),
            },
          ],
          accessControl: {
            disabled: ["admin"],
            hidden: [],
          },
        },
        {
          type: "input",
          subType: "text",
          name: "newName1",
          value: "IVAN",
          visible: false,
          placeholder: "First name",
          hint: "User first name.",
          icon: "phone",
          label: "First Name",
          style: {
            colSpan: 2,
          },
          validations: [
            {
              name: "required",
              message: "First name required",
              validator: Validators.required,
            },
            {
              name: "minlength",
              message: "Min length should be 3.",
              validator: Validators.minLength(3),
            },
          ],
          accessControl: {
            disabled: ["admin"],
            hidden: [],
          },
        },
        {
          type: "input",
          subType: "text",
          name: "newName2",
          value: "IVAN",
          visible: false,
          placeholder: "First name",
          hint: "User first name.",
          icon: "phone",
          label: "First Name",
          style: {
            colSpan: 2,
          },
          validations: [
            {
              name: "required",
              message: "First name required",
              validator: Validators.required,
            },
            {
              name: "minlength",
              message: "Min length should be 3.",
              validator: Validators.minLength(3),
            },
          ],
          accessControl: {
            disabled: ["admin"],
            hidden: [],
          },
        },
        {
          type: "input",
          subType: "text",
          name: "newName3",
          value: "IVAN",
          visible: false,
          placeholder: "First name",
          hint: "User first name.",
          icon: "phone",
          label: "First Name",
          style: {
            colSpan: 2,
          },
          validations: [
            {
              name: "required",
              message: "First name required",
              validator: Validators.required,
            },
            {
              name: "minlength",
              message: "Min length should be 3.",
              validator: Validators.minLength(3),
            },
          ],
          accessControl: {
            disabled: ["admin"],
            hidden: [],
          },
        },
        {
          type: "input",
          subType: "text",
          name: "newName4",
          value: "IVAN",
          visible: false,
          placeholder: "First name",
          hint: "User first name.",
          icon: "phone",
          label: "First Name",
          style: {
            colSpan: 2,
          },
          validations: [
            {
              name: "required",
              message: "First name required",
              validator: Validators.required,
            },
            {
              name: "minlength",
              message: "Min length should be 3.",
              validator: Validators.minLength(3),
            },
          ],
          accessControl: {
            disabled: ["admin"],
            hidden: [],
          },
        },
        {
          type: "input",
          subType: "text",
          name: "newName5",
          value: "IVAN",
          visible: false,
          placeholder: "First name",
          hint: "User first name.",
          icon: "phone",
          label: "First Name",
          style: {
            colSpan: 2,
          },
          validations: [
            {
              name: "required",
              message: "First name required",
              validator: Validators.required,
            },
            {
              name: "minlength",
              message: "Min length should be 3.",
              validator: Validators.minLength(3),
            },
          ],
          accessControl: {
            disabled: ["admin"],
            hidden: [],
          },
        },
        {
          type: "numeric",
          subType: "text",
          name: "Number",
          value: 1,
          decimalCount: 2,
          visible: false,
          readOnly: true,
          placeholder: "Number",
          hint: "User first name.",
          icon: "phone",
          label: "Number",
          style: {
            colSpan: 2,
          },
          validations: [
            {
              name: "required",
              message: "Number required",
              validator: Validators.required,
            },
            {
              name: "minlength",
              message: "Min length should be 3.",
              validator: Validators.minLength(3),
            },
          ],
          accessControl: {
            disabled: ["admin"],
            hidden: [],
          },
        },
        {
          type: "lookup-select",
          name: "genCode",
          label: "Generated Code",
          readOnly: true,
          visible: false,
          //readOnly: true,
          //displayProp: 'name',
          //valueProp: 'id',
          eventValue: "test",
          eventType: "lookup",
          value: 5,
          placeholder: {
            value: "",
            displayText: "--Select--",
          },
          data: {
            options: [1, 2, 3, 4, 5, 6, 7],
          },
          validations: [
            {
              name: "required",
              message: "genCode required",
              validator: Validators.required,
            },
          ],
          // accessControl: {
          //   disabled: ['admin'],
          //   hidden: [],
          // },
        },
        {
          type: "lookup-select",
          name: "genCode1",
          label: "Generated Code1",
          //readOnly: true,
          //displayProp: 'name',
          //valueProp: 'id',
          eventValue: "test",
          eventType: "lookup",
          value: "",
          visible: false,
          placeholder: {
            value: "",
            displayText: "--Select--",
          },
          data: {
            api: {
              onLoad: false,
              isFixed: true,
              method: "getMembers",
              provider: FORM_DATA_SERVICE,
            },
          },

          validations: [
            {
              name: "required",
              message: "genCode required",
              validator: Validators.required,
            },
          ],
          // accessControl: {
          //   disabled: ['admin'],
          //   hidden: [],
          // },
        },
        {
          type: "select-extended",
          name: "countryFull2",
          label: "Country Full",
          displayProp: "name",
          valueProp: "id",
          value: {
            name: "England",
            id: 4,
            countryCode: "+95",
          },
          visible: false,
          hiddenDefault: "",
          placeholder: {
            value: "",
            displayText: "--Select--",
          },
          data: {
            api: {
              isFixed: true,
              onLoad: true,
              provider: FORM_DATA_SERVICE,
              method: "getCountries",
            },
          },
          validations: [
            {
              name: "required",
              message: "Country Full required.",
              validator: Validators.required,
            },
          ],
        },
        {
          type: "select",
          name: "genCode3",
          label: "Generated Code3",
          //displayProp: 'name',
          //valueProp: 'id',
          placeholder: {
            value: "",
            displayText: "--Select--",
          },
          value: "",
          visible: false,
          data: {
            options: [1, 2, 3, 4, 5, 6, 7],
          },
          validations: [
            {
              name: "required",
              message: "genCode required",
              validator: Validators.required,
            },
          ],
          // accessControl: {
          //   disabled: ['admin'],
          //   hidden: [],
          // },
        },
        {
          name: "currentDate",
          type: "date",
          format: "YYYY/MM/DD",
          label: "YYYY/MM/DD",
          placeholder: "Current Date",
          hint: "Current Date",
          value: "2022-12-01T18:30:00.000Z",
          startDate: "2000-12-01",
          startView: "month",
          hiddenDefault: null,
        },
        {
          name: "currentDate1",
          type: "date",
          format: "MM/dd/YY",
          label: "MM/dd/YY",
          placeholder: "Current Date",
          hint: "Current Date",
          value: "2022-12-01T18:30:00.000Z",
          startDate: "2000-12-01",
          startView: "month",
          hiddenDefault: null,
        },
        {
          name: "currentDate2",
          type: "date",
          format: "MM/dd/YYYY",
          label: "MM/dd/YYYY",
          placeholder: "Current Date",
          hint: "Current Date",
          value: "2022-12-01T18:30:00.000Z",
          startDate: "2000-12-01",
          startView: "month",
          hiddenDefault: null,
        },
        {
          name: "currentDate3",
          type: "date",
          format: "dd/MM/YY",
          label: "dd/MM/YY",
          placeholder: "Current Date",
          hint: "Current Date",
          value: "2022-12-01T18:30:00.000Z",
          startDate: "2000-12-01",
          startView: "month",
          hiddenDefault: null,
        },
        {
          name: "currentDate4",
          type: "date",
          format: "YY/MM/dd",
          label: "YY/MM/dd",
          placeholder: "Current Date",
          hint: "Current Date",
          value: "2022-12-01T18:30:00.000Z",
          startDate: "2000-12-01",
          startView: "month",
          hiddenDefault: null,
        },
        {
          name: "currentDate5",
          type: "date",
          format: "dd.MM.YY",
          label: "dd.MM.YY",
          placeholder: "Current Date",
          hint: "Current Date",
          value: "2022-12-01T18:30:00.000Z",
          startDate: "2000-12-01",
          startView: "month",
          hiddenDefault: null,
        },
        {
          name: "currentDate6",
          type: "date",
          format: "dd.MM.YYYY",
          label: "dd.MM.YYYY",
          placeholder: "Current Date",
          hint: "Current Date",
          value: "2022-12-01T18:30:00.000Z",
          startDate: "2000-12-01",
          startView: "month",
          hiddenDefault: null,
        },
        {
          name: "currentDate7",
          type: "date",
          format: "YY-MM-dd",
          label: "YY-MM-dd",
          placeholder: "Current Date",
          hint: "Current Date",
          value: "2022-12-01T18:30:00.000Z",
          startDate: "2000-12-01",
          startView: "month",
          hiddenDefault: null,
        },
        {
          name: "currentDate8",
          type: "date",
          format: "YYYY-MM-dd",
          label: "YYYY-MM-dd",
          placeholder: "Current Date",
          hint: "Current Date",
          value: "2022-12-01T18:30:00.000Z",
          startDate: "2000-12-01",
          startView: "month",
          hiddenDefault: null,
        },
        {
          name: "currentDate10",
          type: "date",
          format: "dd-MM-YY",
          label: "dd-MM-YY",
          placeholder: "Current Date",
          hint: "Current Date",
          value: "2022-12-01T18:30:00.000Z",
          startDate: "2000-12-01",
          startView: "month",
          hiddenDefault: null,
        },
        {
          name: "currentDate11",
          type: "date",
          format: "dd-MM-YYYY",
          label: "dd-MM-YYYY",
          placeholder: "Current Date",
          hint: "Current Date",
          value: "2022-12-01T18:30:00.000Z",
          startDate: "2000-12-01",
          startView: "month",
          hiddenDefault: null,
        },
        {
          name: "currentDate12",
          type: "date",
          format: "YY.MM.dd",
          label: "YY.MM.dd",
          placeholder: "Current Date",
          hint: "Current Date",
          value: "2022-12-01T18:30:00.000Z",
          startDate: "2000-12-01",
          startView: "month",
          hiddenDefault: null,
        },
        {
          name: "currentDate13",
          type: "date",
          format: "YYYY.MM.dd",
          label: "YYYY.MM.dd",
          placeholder: "Current Date",
          hint: "Current Date",
          value: "2022-12-01T18:30:00.000Z",
          startDate: "2000-12-01",
          startView: "month",
          hiddenDefault: null,
        },
        {
          name: "currentDate14",
          type: "date",
          format: "MM/DD/YY",
          label: "MM/DD/YY",
          placeholder: "Current Date",
          hint: "Current Date",
          value: "2022-12-01T18:30:00.000Z",
          startDate: "2000-12-01",
          startView: "month",
          hiddenDefault: null,
        },
        {
          name: "currentDate14",
          type: "date",
          format: "MM/DD/YYYY",
          label: "MM/DD/YYYY",
          placeholder: "Current Date",
          hint: "Current Date",
          value: "2022-12-01T18:30:00.000Z",
          startDate: "2000-12-01",
          startView: "month",
          hiddenDefault: null,
        },
        {
          name: "currentDate15",
          type: "date",
          format: "MMM-DD-YYYY",
          label: "MMM-DD-YYYY",
          placeholder: "Current Date",
          hint: "Current Date",
          value: "2022-12-01T18:30:00.000Z",
          startDate: "2000-12-01",
          startView: "month",
          hiddenDefault: null,
        },
        {
          name: "currentDate16",
          type: "date",
          format: "DD-MMM-YYYY",
          label: "DD-MMM-YYYY",
          placeholder: "Current Date",
          hint: "Current Date",
          value: "2022-12-01T18:30:00.000Z",
          startDate: "2000-12-01",
          startView: "month",
          hiddenDefault: null,
        },
        {
          name: "currentDate17",
          type: "date",
          format: "YYYY-DD-MMM",
          label: "YYYY-DD-MMM",
          placeholder: "Current Date",
          hint: "Current Date",
          value: "2022-12-01T18:30:00.000Z",
          startDate: "2000-12-01",
          startView: "month",
          hiddenDefault: null,
        },
        {
          type: "checkbox-group",
          name: "checkboxGrpMembers",
          value: ["Shabeeb"],
          hint: "select Members",
          label: "Select Members",
          orientation: "horizontal",
          data: {
            options: ["Shabeeb", "Jovin", "Shaju", "Gopa"],
          },
          validations: [
            {
              name: "required",
              message: "Input name required",
              validator: Validators.required,
            },
          ],
          accessControl: {
            disabled: [],
            hidden: [],
          },
        },
        {
          type: "radio-group",
          name: "radioGrp1",
          value: 1,
          hint: "leader selection",
          label: "Select One from Leader",
          orientation: "vertical",
          valueProp: "id",
          displayProp: "name",
          data: {
            options: [
              { id: 1, name: "Shabeeb" },
              { id: 2, name: "Jovin" },
              { id: 3, name: "Gopa" },
              { id: 4, name: "Shaju" },
            ],
          },
          validations: [
            {
              name: "required",
              message: "Input name required",
              validator: Validators.required,
            },
          ],
          accessControl: {
            disabled: [],
            hidden: [],
          },
        },
      ];
      this.appForm = {
        title: "Dynamic Form",
        //columns: 4,
        groups: [
          {
            title: "",
            formFieldControls: [...this.formFields],
          },
        ],
        asyncValidations: [],
        validations: [],
      };

      this.roles = ["admin", "editor"];
    }, 500);

    console.log(
      ">>> NX_API_DEFINITION_URL",
      process.env["NX_API_DEFINITION_URL"]
    );
  }
  //Dynamic UI

  @ViewChild(DataGridComponent)
  dataGrid!: DataGridComponent;

  constructor(
    private snackbarService: SnackBarService,
    private dialogService: DialogService,
    private dynamicFormService: DynamicFormService
  ) {
    this.dynamicFormService.eventSubject$.subscribe((event: EventElement) => {
      console.log(event);
    });

    this.headers = Array.from(Array(150).keys()).map((item) => {
      return {
        name: "column" + item,
        column: "column" + item,
        hidden: false,
        //pinned: 'left',
        width: 200,
      };
    });

    this.data = Array.from(Array(10000).keys()).map((rowItem) => {
      const colRows = Array.from(Array(150).keys()).map((item) => {
        return rowItem + "value";
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
    alert("AddRule");
  }

  onAddRecord() {
    this.dataGrid.clearSelection();
    alert("AddRecord");
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
    this.snackbarService.success("message");
  }

  onErrorClick() {
    this.snackbarService.error(
      "This message is to show error message for upload"
    );
  }

  onWarnClick() {
    this.snackbarService.warn(
      "This message is to show warn message for upload"
    );
  }

  onNotificationClick() {
    this.snackbarService.notification(
      "This message is to show notification message for upload"
    );
  }

  onFullScreen() {
    this.isFullScreen = !this.isFullScreen;
  }

  onConfirmClick() {
    const dialogResult = this.dialogService.openConfirmDialoge({
      title: "Confirm",
      icon: "public",
      message:
        "Do you want to delete, there are lot of things to be checked before it?",
      maxWidth: 400,
    });

    dialogResult.afterClosed().subscribe((val) => {
      console.log(val);
    });
  }

  onInfoClick() {
    const dialogResult = this.dialogService.openInfoDialog({
      title: "Confirm",
      icon: "public",
      yes: "Info",
      message:
        "Do you want to delete, there are lot of things to be checked before it?",
      maxWidth: 400,
    });

    dialogResult.afterClosed().subscribe((val) => {
      console.log(val);
    });
  }
}
