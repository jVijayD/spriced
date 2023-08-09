import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  Injector,
  Input,
  OnDestroy,
  OnInit,
  forwardRef,
} from "@angular/core";
import { BaseComponent } from "../../base.component";
import { NG_VALUE_ACCESSOR } from "@angular/forms";
import { GenericControl } from "../../dynamic-form.types";
import { DynamicFormService } from "../../service/dynamic-form.service";

@Component({
  selector: "sp-checkbox",
  templateUrl: "./checkbox.component.html",
  styleUrls: ["./checkbox.component.scss"],
  changeDetection: ChangeDetectionStrategy.Default,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: forwardRef(() => CheckboxComponent),
    },
  ],
})
export class CheckboxComponent
  extends BaseComponent
  implements OnInit, OnDestroy
{
  @Input()
  set control(inputControl: GenericControl) {
    this._control = inputControl;
    this._initControlData(inputControl);
  }

  get control() {
    return this._control;
  }

  constructor(
    @Inject(Injector) private injector: Injector,
    private dynamicService: DynamicFormService
  ) {
    super(dynamicService);
  }

  ngOnInit(): void {
    this.setFormControl(this.injector);
  }
  ngOnDestroy(): void {
    this.onDestroy();
  }

  private _initControlData(inputControl: GenericControl) {
    this.addRule(inputControl.rule);
    this.setControlAccess();
  }
}
