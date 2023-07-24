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
import { BaseDataComponent } from "../../base-data.component";
import {
  GenericControl,
  SelectExtendedControl,
} from "../../dynamic-form.types";
import { DynamicFormService } from "../../service/dynamic-form.service";

@Component({
  selector: "sp-select-extended",
  templateUrl: "./select-extended.component.html",
  styleUrls: ["./select-extended.component.scss"],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: forwardRef(() => SelectExtendedComponent),
    },
  ],
})
export class SelectExtendedComponent
  extends BaseDataComponent
  implements OnInit, OnDestroy
{
  private _localValue: any;

  @Input()
  set control(selectControl: GenericControl) {
    this._control = selectControl;
    //this.hiddenDefault = this._control.hiddenDefault;
    this._initControlData(selectControl);
  }

  get control(): SelectExtendedControl {
    return this._control as SelectExtendedControl;
  }

  // used to extend the normal val with selected object
  set localValue(val: any) {
    this._localValue = val;
    this.setControlValue(val);
  }

  // used to extend the normal val with selected object
  get localValue() {
    return this.getControlValue();
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

  onSelectionChange(e: any) {
    this.value = e.value;
  }

  private setControlValue(val: any) {
    const selectControl = this._control as SelectExtendedControl;

    if (this.source) {
      this.value = this.source.find(
        (item) => item[selectControl.valueProp] === val
      );
    }
  }

  private getControlValue() {
    let retValue = null;
    const selectControl = this._control as SelectExtendedControl;
    if (this.value) {
      retValue = (this.value as any)[selectControl.valueProp];
    } else {
      retValue = selectControl.placeholder?.value;
    }

    return retValue;
  }

  private _initControlData(selectControl: GenericControl) {
    this.populateSource();
    this.addRule(selectControl.rule);
    this.setControlAccess();
  }
}
