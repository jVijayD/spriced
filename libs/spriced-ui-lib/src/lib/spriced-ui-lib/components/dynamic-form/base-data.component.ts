import { Subject, Subscription } from "rxjs";
import { BaseComponent } from "./base.component";
import { DynamicFormService } from "./service/dynamic-form.service";
import { DataControl, IData } from "./dynamic-form.types";

export abstract class BaseDataComponent extends BaseComponent {
  dataPopulation$: Subject<unknown[]> = new Subject();
  private _dataSubscriptions: Subscription[] = [];
  source: any[] = [];

  constructor(dynamicService: DynamicFormService) {
    super(dynamicService);
    this._dataSubscriptions.push(
      this.ruleExecution$.subscribe(this._ruleExecutionSubscriber.bind(this))
    );
  }

  private _ruleExecutionSubscriber(event: {
    isSuccess: boolean;
    result: any;
  }): void {
    if (
      (event.result.type === "display" || event.result.type === "load") &&
      event.isSuccess
    ) {
      if (event.result.params.display) {
        const controlData = this._control as DataControl;
        if (controlData.data.api && !controlData.data.api?.onLoad) {
          this._getDataSource(controlData.data);
        }
      }
    }
  }

  private _getDataSource(controlData: IData) {
    if (this.visible) {
      const observable$: any = this.dynamicFormService?.execFun(
        controlData.api?.method as string,
        controlData.api?.params || []
      );

      this._dataSubscriptions.push(
        observable$.subscribe((items: unknown[]) => {
          this.source = items;
          this.dataPopulation$.next(items);
        })
      );
    }
  }

  populateSource() {
    const controlData = this._control as DataControl;
    if (controlData.data.api) {
      if (controlData.data.api?.onLoad) {
        this._getDataSource(controlData.data);
      }
    } else {
      this.source = controlData.data.options || [];
    }
  }

  populateSourceOnDemand() {
    const controlData = this._control as DataControl;
    if (
      controlData.data.api &&
      (this.source.length == 0 || !controlData.data.api?.isFixed)
    ) {
      this._getDataSource(controlData.data);
    }
  }

  override onDestroy(): void {
    this._dataSubscriptions.forEach((item) => item.unsubscribe());
    super.onDestroy();
  }
}
