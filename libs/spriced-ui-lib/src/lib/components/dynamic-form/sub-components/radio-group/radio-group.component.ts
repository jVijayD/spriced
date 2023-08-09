import {
  Component,
  Inject,
  Injector,
  Input,
  OnDestroy,
  OnInit,
  forwardRef,
} from "@angular/core";
import { BaseDataComponent } from "../../base-data.component";
import { Subscription } from "rxjs";
import {
  GenericControl,
  RadioButtonGroupControl,
} from "../../dynamic-form.types";
import { DynamicFormService } from "../../service/dynamic-form.service";
import { NG_VALUE_ACCESSOR } from "@angular/forms";

@Component({
  selector: "sp-radio-group",
  templateUrl: "./radio-group.component.html",
  styleUrls: ["./radio-group.component.scss"],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: forwardRef(() => RadioGroupComponent),
    },
  ],
})
export class RadioGroupComponent
  extends BaseDataComponent
  implements OnInit, OnDestroy
{
  subscription!: Subscription;

  @Input()
  set control(inputControl: GenericControl) {
    this._control = inputControl;
    this._initControlData(inputControl);
  }

  get control(): RadioButtonGroupControl {
    return this._control as RadioButtonGroupControl;
  }

  override set value(val: any) {
    if (this.control.selProp) {
      this._assignObjectSelection(val, this.source);
    } else {
      super.value = val;
    }
  }

  override get value() {
    return super.value;
  }

  constructor(
    @Inject(Injector) private injector: Injector,
    private dynamicService: DynamicFormService
  ) {
    super(dynamicService);
  }

  ngOnInit(): void {
    this.setFormControl(this.injector);
    this._subscribeSourceUpdate();
  }

  ngOnDestroy(): void {
    this.onDestroy();
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  private _assignObjectSelection(val: any, source: any[]) {
    if (this.control.selProp) {
      const filterSel = source.find((item: any) => {
        const sourceItemVal = item[this.control.selProp as string];
        const selItemVal = val[this.control.selProp as string];
        return sourceItemVal == selItemVal;
      });
      super.value = filterSel;
    }
  }

  private _subscribeSourceUpdate() {
    this.subscription = this.dataPopulation$.subscribe((source) => {
      this._assignObjectSelection(this.value, source);
    });
  }

  private _initControlData(inputControl: GenericControl) {
    // Default Population of data if required.
    this.populateSource();
    this.addRule(inputControl.rule);
    this.setControlAccess();
  }
}
