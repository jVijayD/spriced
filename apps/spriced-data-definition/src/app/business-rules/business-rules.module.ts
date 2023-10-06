import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from "@angular/core";
import { CommonModule, DatePipe } from "@angular/common";

import { BusinessRuleNameComponent } from "./business-rule-name/business-rule-name.component";
import { ListComponent } from "./list/list.component";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatSelectModule } from "@angular/material/select";
import { MatInputModule } from "@angular/material/input";
import { MatButtonModule } from "@angular/material/button";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatDialogModule } from "@angular/material/dialog";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { DragDropModule } from "@angular/cdk/drag-drop";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatGridListModule } from "@angular/material/grid-list";
import { RouterModule } from "@angular/router";
import { routes } from "./business-rules-routing.module";
import {
  HTTP_INTERCEPTORS,
  HttpClient,
  HttpClientModule,
} from "@angular/common/http";
import { MatTableModule } from "@angular/material/table";
import {
  DataGridComponent,
  DialogueModule,
  HeaderActionComponent,
  OneColComponent,
  SnackBarService,
  SnackbarModule,
} from "@spriced-frontend/spriced-ui-lib";
import { ModelAddComponent } from "../pages/model/components/model-add/model-add.component";
import { BusinessRuleListComponent } from "./BusinessRuleList/business-rule-list.component";
import { BusinessactionsComponent } from "./businessactions/businessactions.component";
import { ElseactionComponent } from "./elseaction/elseaction.component";
import {
  NGX_MAT_DATE_FORMATS,
  NgxMatDateAdapter,
  NgxMatDatetimePickerModule,
  NgxMatTimepickerModule,
} from "@angular-material-components/datetime-picker";
import {
  MAT_MOMENT_DATE_ADAPTER_OPTIONS,
  MatMomentDateModule,
} from "@angular/material-moment-adapter";
import { MAT_DATE_FORMATS, MAT_DATE_LOCALE } from "@angular/material/core";
import { DateAdapterService } from "@spriced-frontend/spriced-common-lib";
import { headerInterceptor } from "libs/shared/spriced-shared-lib/src/lib/auth/header-interceptor";
import { MessageService } from "./services/message.service";
import { NgxMatSelectSearchModule } from "ngx-mat-select-search";

const MY_DATE_FORMAT = {
  parse: {
    dateInput: "LL", // Specifies the input format for parsing dates
    // dateOutput: 'MM/DD/YYYY', // Specifies the output format for displaying dates
  },
  display: {
    dateInput: "MM/DD/YYYY", // Specifies the format for displaying dates in the input field
    monthYearLabel: "MMMM YYYY", // Specifies the format for displaying the month and year in the datepicker header
    dateA11yLabel: "LL", // Specifies the format for accessibility labels of dates
    monthYearA11yLabel: "MMMM YYYY", // Specifies the format for accessibility labels of the month and year
  },
};

const NGX_DATE_FORMAT = {
  parse: {
    dateInput: "1, LTS", // Specifies the input format for parsing dates
    // dateOutput: 'MM/DD/YYYY', // Specifies the output format for displaying dates
  },
  display: {
    dateInput: "MM/DD/YYYY HH:mm:ss a", // Specifies the format for displaying dates in the input field
    monthYearLabel: "MMMM YYYY", // Specifies the format for displaying the month and year in the datepicker header
    dateA11yLabel: "LL", // Specifies the format for accessibility labels of dates
    monthYearA11yLabel: "MMMM YYYY", // Specifies the format for accessibility labels of the month and year
  },
};
@NgModule({
  declarations: [
    BusinessRuleNameComponent,
    ListComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    MatTableModule,
    MatCheckboxModule,
    FormsModule,
    MatSelectModule,
    MatInputModule,
    MatButtonModule,
    MatFormFieldModule,
    MatGridListModule,
    MatIconModule,
    MatProgressSpinnerModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatSnackBarModule,
    DragDropModule,
    OneColComponent,
    DataGridComponent,
    HeaderActionComponent,
    ModelAddComponent,
    DialogueModule,
    SnackbarModule,
    BusinessRuleListComponent,
    BusinessactionsComponent,
    ElseactionComponent,
    NgxMatSelectSearchModule
  ],
  providers: [
    HttpClient,
    HttpClientModule,
    DatePipe,
    SnackBarService,
    MessageService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: headerInterceptor,
      multi: true,
    },
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMAT },
    { provide: MAT_DATE_LOCALE, useValue: "en-US" },
    {
      provide: NgxMatDateAdapter,
      useClass: DateAdapterService,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
    },
    { provide: NGX_MAT_DATE_FORMATS, useValue: NGX_DATE_FORMAT },
    NgxMatDatetimePickerModule,
    NgxMatTimepickerModule,
    MatMomentDateModule,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class BusinessRulesModule {}
