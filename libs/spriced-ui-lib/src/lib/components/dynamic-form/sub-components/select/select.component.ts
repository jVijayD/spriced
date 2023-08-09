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
import { BaseDataComponent } from "../../base-data.component";
import { GenericControl } from "../../dynamic-form.types";
import { DynamicFormService } from "../../service/dynamic-form.service";
import { NG_VALUE_ACCESSOR } from "@angular/forms";

@Component({
  selector: "sp-select",
  templateUrl: "./select.component.html",
  styleUrls: ["./select.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: forwardRef(() => SelectComponent),
    },
  ],
})
export class SelectComponent
  extends BaseDataComponent
  implements OnInit, OnDestroy
{
  @Input()
  set control(selectControl: GenericControl) {
    this._control = selectControl;
    //this.hiddenDefault = this._control.hiddenDefault;
    this._initControlData(selectControl);
  }

  get control() {
    return this._control;
  }

  constructor(
    @Inject(Injector) private injector: Injector,
    private dynamicService: DynamicFormService
  ) {
    super(dynamicService);
    //this._control = _defaultSelect;
  }
  ngOnDestroy(): void {
    this.onDestroy();
  }
  ngOnInit(): void {
    this.setFormControl(this.injector);
  }

  private _initControlData(selectControl: GenericControl) {
    this.populateSource();
    this.addRule(selectControl.rule);
    this.setControlAccess();
  }
}
