import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InputComponent } from './sub-components/input/input.component';
import { ErrorComponent } from './sub-components/error/error.component';
import { DataPickerComponent } from './sub-components/data-picker/data-picker.component';
import { CheckboxGroupComponent } from './sub-components/checkbox-group/checkbox-group.component';
import { InputValuePickerComponent } from './sub-components/input-value-picker/input-value-picker.component';
import { SelectComponent } from './sub-components/select/select.component';
import { SelectExtendedComponent } from './sub-components/select-extended/select-extended.component';
import { RadioGroupComponent } from './sub-components/radio-group/radio-group.component';
import { DynamicFormComponent } from './dynamic-form.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { DynamicFormContainerComponent } from './dynamic-form-container/dynamic-form-container.component';
import { NumericDirective } from './sub-components/directives/numeric.directive';
import { NumericComponent } from './sub-components/numeric/numeric.component';

@NgModule({
  declarations: [
    InputComponent,
    NumericComponent,
    ErrorComponent,
    DataPickerComponent,
    CheckboxGroupComponent,
    InputValuePickerComponent,
    SelectComponent,
    SelectExtendedComponent,
    RadioGroupComponent,
    DynamicFormComponent,
    DynamicFormContainerComponent,
    NumericDirective,
  ],
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    ReactiveFormsModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  exports: [
    InputComponent,
    NumericComponent,
    ErrorComponent,
    DataPickerComponent,
    CheckboxGroupComponent,
    InputValuePickerComponent,
    SelectComponent,
    SelectExtendedComponent,
    RadioGroupComponent,
    DynamicFormComponent,
    DynamicFormContainerComponent,
    NumericDirective,
  ],
})
export class DynamicFormModule {}
