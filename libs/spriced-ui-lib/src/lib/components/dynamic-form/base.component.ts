import { Injector } from "@angular/core";
import {
  ControlValueAccessor,
  FormControl,
  FormControlDirective,
  FormControlName,
  FormGroupDirective,
  NgControl,
  NgModel,
} from "@angular/forms";
import { Engine as RuleEngine } from "json-rules-engine";
import { Subject, Subscription } from "rxjs";
import { GenericControl, IRule } from "./dynamic-form.types";
import { DynamicFormService } from "./service/dynamic-form.service";
import * as moment from "moment";

export abstract class BaseComponent implements ControlValueAccessor {
  private _value: unknown;
  private _ruleEngine!: RuleEngine;
  private _hasRule = false;
  private _visible = true;
  private _subscriptions: Subscription[] = [];
  private _valueChanged$: Subject<any> = new Subject();

  protected _control!: GenericControl;
  protected ruleExecution$ = new Subject<{
    isSuccess: boolean;
    result: unknown;
  }>();

  disabled = false;
  frmControl!: FormControl;

  onChange!: (value: unknown) => void;
  onTouched!: (value?: unknown) => void;

  set visible(isVisible: boolean) {
    if (this._visible !== isVisible) {
      this._visible = isVisible;

      if (!this.visible) {
        this.value = this._control.hiddenDefault;
        //Remove validations in case of not visible
        this.clearValidators();
      } else {
        this.frmControl.updateValueAndValidity();
      }
    }
  }

  get visible() {
    return this._visible;
  }

  set value(val: unknown) {
    try {
      if (val !== this._value) {
        this._value = val;
        this.onChange(val);
        this._valueChanged$.next(val);
        //this.onTouched(val);
      }
    } catch (error) {
      if (val !== null) {
        throw error;
      }
    }
  }

  get value() {
    return this._value;
  }

  protected getValueChangedObservable() {
    return this._valueChanged$.asObservable();
  }

  constructor(protected dynamicFormService: DynamicFormService) {
    this.onChange = (value: unknown) => {
      console.log("default implementation-" + value);
    };
    this.onTouched = (value: unknown) => {
      console.log("default implementation-" + value);
    };
    this.initRuleEngine();
  }

  writeValue(obj: unknown): void {
    let timezone = localStorage.getItem("timezone") as string || 'null';
    if (this._control.type == 'date' && timezone == 'normal') {
      this.value = moment(obj as string).parseZone();
    }
    else {
      this.value = obj;
    }

  }

  registerOnChange(fn: (value: unknown) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: (value: unknown) => void): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  addRule(rule?: IRule) {
    if (rule) {
      rule.properties.name = rule.name;
      this._hasRule = true;
      this._ruleEngine.removeRule(rule.name);
      //adding the configured rules
      this._ruleEngine.addRule(rule.properties);
      this._subscriptions.forEach((item) => item.unsubscribe());
      this.registerRuleExec(rule).forEach((item) => {
        this._subscriptions.push(item);
      });

      this.runRule(this.dynamicFormService?.getFormValues);
    }
  }

  // registerRuleExecution() {
  //   return this.dynamicFormService?.parentForm?.valueChanges.subscribe(
  //     (item) => {
  //       if (this._hasRule) {
  //         this.runRule(item);
  //       }
  //     }
  //   );
  // }

  registerRuleExec(rule: IRule) {
    const subscriptions: Subscription[] = [];
    if (rule) {
      const conditions: string[] = rule.dependantItems || [];
      conditions.forEach((item) => {
        const ctrl = this.dynamicFormService?.getFormItemValue(item);
        if (ctrl) {
          subscriptions.push(
            ctrl?.valueChanges.subscribe((val) => {
              if (this._hasRule) {
                this.runRule(this.createFact(item, val));
              }
            }) as Subscription
          );
        }
      });
    }
    return subscriptions;
  }

  resetValue(val: unknown) {
    this.value = val;
  }

  private createFact(item: string, value: unknown) {
    const fact: any = {};
    fact[item] = value;
    return { ...this.dynamicFormService?.getFormValues(), ...fact };
  }

  private initRuleEngine() {
    this._ruleEngine = new RuleEngine([], {
      allowUndefinedFacts: true,
    });

    this._ruleEngine.on("success", (eventResult: unknown) => {
      this.displayRule(eventResult, true);
      this.ruleExecution$.next({ isSuccess: true, result: eventResult });
    });

    this._ruleEngine.on("failure", (eventResult) => {
      this.displayRule(eventResult, false);
      this.ruleExecution$.next({ isSuccess: false, result: eventResult });
    });
  }

  private displayRule(eventResult: any, success: boolean): void {
    if (eventResult.type === "display") {
      if (eventResult.params.display !== undefined) {
        const isVisible = eventResult.params.display;
        this.visible = success ? isVisible : !isVisible;
      } else {
        this.visible = true;
      }

      if (eventResult.params.disabled !== undefined) {
        const disabled = eventResult.params.disabled;
        this.disabled = success ? disabled : !disabled;
      } else {
        this.disabled = false;
      }
    }
  }

  private runRule(facts: any): void {
    this._ruleEngine.run(facts).catch((error) => {
      console.log("Rule Execution Error:", error);
    });
  }

  private clearValidators() {
    this.frmControl.setErrors(null);
  }

  getValue(target: EventTarget | null) {
    let value: unknown;
    if (target) {
      value = (target as HTMLInputElement).value;
    }
    return value;
  }

  setFormControl(injector: Injector) {
    const injectedControl = injector.get(NgControl);
    switch (injectedControl.constructor) {
      case NgModel: {
        const { control } = injectedControl as NgModel;
        this.frmControl = control;
        break;
      }
      case FormControlName: {
        this.frmControl = injector
          .get(FormGroupDirective)
          .getControl(injectedControl as FormControlName);
        break;
      }
      default: {
        this.frmControl = (injectedControl as FormControlDirective)
          .form as FormControl;
        break;
      }
    }
  }

  setControlAccess() {
    if (this._control.accessControl) {
      const isDisabled = this._control.accessControl.disabled.some((item) => {
        return this.dynamicFormService?.roles.includes(item);
      });

      const isHidden = this._control.accessControl.hidden.some((item) => {
        return this.dynamicFormService?.roles.includes(item);
      });

      this.disabled = isDisabled;
      this.visible = !isHidden;
    }
  }

  onDestroy() {
    this._subscriptions.forEach((item) => item.unsubscribe());
  }

  //Added tooltip: Author - Anu, convert value to string since its type is unknown
  convertToString(value:any)
  {
  if(value)
  {
    return value.toString()
  }
  }
}
