import { Component, Input } from '@angular/core';
import { IValidator } from '../../dynamic-form.types';
import { ValidationErrors } from '@angular/forms';
@Component({
  selector: 'sp-error',
  templateUrl: './error.component.html',
  styleUrls: ['./error.component.scss'],
})
export class ErrorComponent {
  @Input()
  validations: IValidator[] = [];

  @Input()
  errors!: ValidationErrors;
}
