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
import { DatePickerComponent } from "./sub-components/date-picker/date-picker.component";
import { DateTimePickerComponent } from "./sub-components/date-time-picker/date-time-picker.component";
import { DateRangeComponent } from "./sub-components/date-range/date-range.component";
import { DateFormatDirective } from "./directives/dateformat-yyyymmdd.directive";
import { DateFormatDirectiveMMddyy } from "./directives/dateformat-MMddyy.directive";
import { DateFormatDirectiveMMddyyyy } from "./directives/dateformat-MMddyyyy.directive";
import { DateFormatDirectiveddMMYY } from "./directives/dateformat-ddMMyy.directive";
import { DateFormatDirectiveYYMMdd } from "./directives/dateformat-yyMMdd.directive";
import { DateFormatDirectivedd_MM_YY } from "./directives/dateformat-dd.MM.yy.directive";
import { DateFormatDirectivedd_MM_YYYY } from "./directives/dateformat-dd.MM.yyyy.directive";
import { DateFormatDirectiveYY__MM__dd } from "./directives/dateformat-yy-MM-dd.directive";
import { DateFormatDirectiveYYYY__MM__dd } from "./directives/dateformat-yyyy-MM-dd.directive";
import { DateFormatDirectivedd__MM__YYYY } from "./directives/dateformat-dd-MM-yyyy.directive";
import { DateFormatDirectivedd__MM__YY } from "./directives/dateformat-dd-MM-yy.directive";
import { DateFormatDirectiveYY_MM_dd } from "./directives/dateformat-yy.MM.dd.directive";
import { DateFormatDirectiveYYYY_MM_dd } from "./directives/dateformat-yyyy.mm.dd.directive";
import { DateFormatDirectiveMMDDyy } from "./directives/dateformat.MMDDyy.directive";
import { DateFormatDirectiveMMDDyyyy } from "./directives/dateformat.MMDDyyyy.directive";
import { DateFormatDirectiveDDMMYY } from "./directives/dateformat-DDMMMyy.directive";
import { DateFormatDirectivedMMM__DD__YYYY } from "./directives/MMM-DD-YYYY.directive";
import { DateFormatDirectiveDD_MMM__YYYY } from "./directives/DD-MMM-YYYY.directive";
import { DateFormatDirectiveYYYY__DD__MMM } from "./directives/YYYY-DD-MMM.directive";

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
    DateFormatDirective,
    DateFormatDirectiveMMddyy,
    DateFormatDirectiveMMddyyyy,
    DateFormatDirectiveddMMYY,
    DateFormatDirectiveYYMMdd,
    DateFormatDirectivedd_MM_YY,
    DateFormatDirectivedd_MM_YYYY,
    DateFormatDirectiveYY__MM__dd,
    DateFormatDirectiveYYYY__MM__dd,
    DateFormatDirectivedd_MM_YY,
    DateFormatDirectivedd__MM__YY,
    DateFormatDirectivedd__MM__YYYY,
    DateFormatDirectiveYY_MM_dd,
    DateFormatDirectiveYYYY_MM_dd,
    DateFormatDirectiveMMDDyy,
    DateFormatDirectiveMMDDyyyy,
    DateFormatDirectiveDDMMYY,
    DateFormatDirectivedMMM__DD__YYYY,
    DateFormatDirectiveDD_MMM__YYYY,
    DateFormatDirectiveYYYY__DD__MMM,
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
    DateFormatDirective,
    DateFormatDirectiveMMddyy,
    DateFormatDirectiveMMddyyyy,
    DateFormatDirectiveddMMYY,
    DateFormatDirectiveYYMMdd,
    DateFormatDirectivedd_MM_YY,
    DateFormatDirectivedd_MM_YYYY,
    DateFormatDirectiveYY__MM__dd,
    DateFormatDirectiveYYYY__MM__dd,
    DateFormatDirectivedd_MM_YY,
    DateFormatDirectivedd__MM__YY,
    DateFormatDirectivedd__MM__YYYY,
    DateFormatDirectiveYY_MM_dd,
    DateFormatDirectiveYYYY_MM_dd,
    DateFormatDirectiveMMDDyy,
    DateFormatDirectiveMMDDyyyy,
    DateFormatDirectiveDDMMYY,
    DateFormatDirectivedMMM__DD__YYYY,
    DateFormatDirectiveDD_MMM__YYYY,
    DateFormatDirectiveYYYY__DD__MMM,
  ],
})
export class DynamicFormModule {}
