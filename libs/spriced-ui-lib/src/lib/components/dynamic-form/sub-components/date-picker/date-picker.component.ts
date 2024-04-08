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
import { NG_VALUE_ACCESSOR } from "@angular/forms";
import { BaseComponent } from "../../base.component";
import { DateControl, GenericControl } from "../../dynamic-form.types";
import { DynamicFormService } from "../../service/dynamic-form.service";
import { unixTimeStamp } from "@spriced-frontend/spriced-common-lib";
import * as moment from "moment-timezone";
@Component({
  selector: "sp-date-picker",
  templateUrl: "./date-picker.component.html",
  styleUrls: ["./date-picker.component.scss"],
  changeDetection: ChangeDetectionStrategy.Default,
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

  // HANDLE THIS FUNCTION FOR CHANGE THE TIME STAMP
  public changeTimeStamp(date: any) {
    if (!!date) {
      let timezone = (localStorage.getItem("timezone") as string) || "null";
      if (timezone !== "null") {
        this.value = moment(this.value as string).tz(timezone);
      } else {
        this.value = unixTimeStamp(date);
      }
    }
  }
}
