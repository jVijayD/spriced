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
import { DynamicFormService } from "../../service/dynamic-form.service";
import { GenericControl } from "../../dynamic-form.types";
import { NG_VALUE_ACCESSOR } from "@angular/forms";

@Component({
  selector: "sp-input",
  templateUrl: "./input.component.html",
  styleUrls: ["./input.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: forwardRef(() => InputComponent),
    },
  ],
})
export class InputComponent extends BaseComponent implements OnInit, OnDestroy {
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
