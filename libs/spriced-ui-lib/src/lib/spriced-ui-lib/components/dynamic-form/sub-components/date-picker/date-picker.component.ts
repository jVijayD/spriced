import {
  Component,
  Inject,
  Injector,
  Input,
  OnDestroy,
  OnInit,
  forwardRef,
} from "@angular/core";
import { NG_VALUE_ACCESSOR } from "@angular/forms";
import { BaseComponent } from "../../base.component";
import { DateControl, GenericControl } from "../../dynamic-form.types";
import { DynamicFormService } from "../../service/dynamic-form.service";

@Component({
  selector: "sp-date-picker",
  templateUrl: "./date-picker.component.html",
  styleUrls: ["./date-picker.component.scss"],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: forwardRef(() => DatePickerComponent),
    },
  ],
})
export class DatePickerComponent
  extends BaseComponent
  implements OnInit, OnDestroy
{
  @Input()
  startDate!: Date;

  @Input()
  set control(dateControl: GenericControl) {
    this._control = dateControl;
    //this.hiddenDefault = this._control.hiddenDefault;
    this._initControlData(dateControl);
  }

  get control(): DateControl {
    return this._control as DateControl;
  }

  constructor(
    @Inject(Injector) private injector: Injector,
    private dynamicService: DynamicFormService
  ) {
    super(dynamicService);
  }

  ngOnDestroy(): void {
    this.onDestroy();
  }

  ngOnInit(): void {
    this.setFormControl(this.injector);
  }

  private _initControlData(dateControl: GenericControl) {
    this.addRule(dateControl.rule);
    this.setControlAccess();
  }
}
