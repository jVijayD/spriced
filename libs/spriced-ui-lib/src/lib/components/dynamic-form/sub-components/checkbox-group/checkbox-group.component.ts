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
import { SelectionModel } from "@angular/cdk/collections";
import { Subscription } from "rxjs";
import { CheckboxGroupControl, GenericControl } from "../../dynamic-form.types";
import { DynamicFormService } from "../../service/dynamic-form.service";
import { NG_VALUE_ACCESSOR } from "@angular/forms";

@Component({
  selector: "sp-checkbox-group",
  templateUrl: "./checkbox-group.component.html",
  styleUrls: ["./checkbox-group.component.scss"],
  changeDetection: ChangeDetectionStrategy.Default,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: forwardRef(() => CheckboxGroupComponent),
    },
  ],
})
export class CheckboxGroupComponent
  extends BaseDataComponent
  implements OnInit, OnDestroy
{
  selection!: SelectionModel<any>;
  subscription!: Subscription;

  @Input()
  set control(inputControl: GenericControl) {
    this._control = inputControl;
    //this.hiddenDefault = this._control.hiddenDefault;
    this._initControlData(inputControl);
  }

  get control(): CheckboxGroupControl {
    return this._control as CheckboxGroupControl;
  }

  override set value(val: any[]) {
    if (this.control.selProp) {
      this._assignObjectSelection(val, this.source);
    } else {
      val.forEach((item) => {
        this.selection.select(item);
      });
      super.value = val;
    }
  }

  constructor(
    @Inject(Injector) private injector: Injector,
    private dynamicService: DynamicFormService
  ) {
    super(dynamicService);
    this.selection = new SelectionModel<any>(true, []);
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

  setSelection(item: any) {
    this.selection.toggle(item);
    this.value = this.selection.selected;
  }

  private _assignObjectSelection(val: any[], source: any[]) {
    if (this.control.selProp) {
      const filterSel = source.filter((item: any) => {
        return (
          val.find((itemVal) => {
            return (
              itemVal[this.control.selProp as string] ==
              item[this.control.selProp as string]
            );
          }) !== undefined
        );
      });
      filterSel.forEach((item) => {
        this.selection.select(item);
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
