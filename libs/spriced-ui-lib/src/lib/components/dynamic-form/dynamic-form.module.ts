import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MatMomentDateModule } from "@angular/material-moment-adapter";
import { InputComponent } from "./sub-components/input/input.component";
import { ErrorComponent } from "./sub-components/error/error.component";
import { CheckboxGroupComponent } from "./sub-components/checkbox-group/checkbox-group.component";
import { InputValuePickerComponent } from "./sub-components/input-value-picker/input-value-picker.component";
import { SelectComponent } from "./sub-components/select/select.component";
import { SelectExtendedComponent } from "./sub-components/select-extended/select-extended.component";
import { RadioGroupComponent } from "./sub-components/radio-group/radio-group.component";
import { DynamicFormComponent } from "./dynamic-form.component";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatInputModule } from "@angular/material/input";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatRadioModule } from "@angular/material/radio";
import { DynamicFormContainerComponent } from "./dynamic-form-container/dynamic-form-container.component";
import { NumericDirective } from "./directives/numeric.directive";
import { NumericComponent } from "./sub-components/numeric/numeric.component";
import { LookupSelectComponent } from "./sub-components/lookup-select/lookup-select.component";
import { LookupGridPickerComponent } from "./sub-components/lookup-grid-picker/lookup-grid-picker.component";
import { MatNativeDateModule, MatOptionModule } from "@angular/material/core";
import { MatTooltipModule } from "@angular/material/tooltip";
import { DatePickerComponent } from "./sub-components/date-picker/date-picker.component";
import { DateTimePickerComponent } from "./sub-components/date-time-picker/date-time-picker.component";
import { DateRangeComponent } from "./sub-components/date-range/date-range.component";

import { CheckboxComponent } from "./sub-components/checkbox/checkbox.component";
import { MatSelectModule } from "@angular/material/select";
import { DateFormatDirectiveDDMMYY } from "./directives/dateformat-ddMMyy.directive";
import { DateFormatDirectiveDDMMYYYY } from "./directives/dateformat-DDMMYYYY.directive";
import { DateFormatDirectiveMMDDYY } from "./directives/dateformat.MMDDyy.directive";
import { DateFormatDirectiveMMDDYYYY } from "./directives/dateformat.MMDDyyyy.directive";
import { DateFormatDirectiveYYMMDD } from "./directives/dateformat-yyMMdd.directive";
import { DateFormatDirectiveDD__MM__YY } from "./directives/dateformat-dd-MM-yy.directive";
import { DateFormatDirectiveDD__MM__YYYY } from "./directives/dateformat-dd-MM-yyyy.directive";
import { DateFormatDirectiveYY__MM__DD } from "./directives/dateformat-yy-MM-dd.directive";
import { DateFormatDirectiveYYYY__MM__DD } from "./directives/dateformat-yyyy-MM-dd.directive";
import { DateFormatDirectiveYYYYMMDD } from "./directives/.dateformat-yyyymmdd.directive";
import { LookupDialogComponent } from "./sub-components/lookup-select/lookup-dialog/lookup-dialog/lookup-dialog.component";
import { NgxDatatableModule } from "@swimlane/ngx-datatable";

@NgModule({
  declarations: [
    InputComponent,
    NumericComponent,
    ErrorComponent,
    CheckboxGroupComponent,
    InputValuePickerComponent,
    SelectComponent,
    SelectExtendedComponent,
    RadioGroupComponent,
    DynamicFormComponent,
    DynamicFormContainerComponent,
    NumericDirective,
    LookupSelectComponent,
    LookupSelectComponent,
    LookupGridPickerComponent,
    CheckboxGroupComponent,
    RadioGroupComponent,
    DatePickerComponent,
    DateTimePickerComponent,
    DateRangeComponent,
    DateFormatDirectiveMMDDYY,
    DateFormatDirectiveMMDDYYYY,
    DateFormatDirectiveDDMMYY,
    DateFormatDirectiveDDMMYYYY,
    DateFormatDirectiveYYMMDD,
    DateFormatDirectiveDD__MM__YY,
    DateFormatDirectiveDD__MM__YYYY,
    DateFormatDirectiveYY__MM__DD,
    DateFormatDirectiveYYYY__MM__DD,
    DateFormatDirectiveYYYYMMDD,
    CheckboxComponent,
    LookupDialogComponent,
  ],
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    ReactiveFormsModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatOptionModule,
    MatNativeDateModule,
    MatDatepickerModule,
    MatMomentDateModule,
    MatCheckboxModule,
    MatRadioModule,
    MatSelectModule,
    MatTooltipModule,
    NgxDatatableModule
  ],
  exports: [
    InputComponent,
    NumericComponent,
    ErrorComponent,
    CheckboxGroupComponent,
    InputValuePickerComponent,
    SelectComponent,
    SelectExtendedComponent,
    RadioGroupComponent,
    DynamicFormComponent,
    DynamicFormContainerComponent,
    NumericDirective,
    LookupSelectComponent,
    LookupSelectComponent,
    LookupGridPickerComponent,
    CheckboxGroupComponent,
    RadioGroupComponent,
    DatePickerComponent,
    DateTimePickerComponent,
    DateRangeComponent,
    DateFormatDirectiveMMDDYY,
    DateFormatDirectiveMMDDYYYY,
    DateFormatDirectiveDDMMYY,
    DateFormatDirectiveDDMMYYYY,
    DateFormatDirectiveYYMMDD,
    DateFormatDirectiveDD__MM__YY,
    DateFormatDirectiveDD__MM__YYYY,
    DateFormatDirectiveYY__MM__DD,
    DateFormatDirectiveYYYY__MM__DD,
    CheckboxComponent,
  ],
})
export class DynamicFormModule {}
