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
import {
  DataControl,
  GenericControl,
  LookupSelectControl,
} from "../../dynamic-form.types";
import {
  DynamicFormService,
  EventElement,
} from "../../service/dynamic-form.service";
import { NG_VALUE_ACCESSOR } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { LookupDialogComponent } from "./lookup-dialog/lookup-dialog/lookup-dialog.component";
import { Subscription } from "rxjs";

const LOOKUP_PAGE_SIZE = 50;
@Component({
  selector: "sp-lookup-select",
  templateUrl: "./lookup-select.component.html",
  styleUrls: ["./lookup-select.component.scss"],
  changeDetection: ChangeDetectionStrategy.Default,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: forwardRef(() => LookupSelectComponent),
    },
  ],
})
export class LookupSelectComponent
  extends BaseDataComponent
  implements OnInit, OnDestroy
{
  //public prop: string = "code|name";
  pageSize: number = LOOKUP_PAGE_SIZE;
  displayValue: any = "";
  lookupDataId: any;
  filteredSource: any = [];
  dialogReference: any = null;
  subscriptions: Subscription[] = [];
  totalCount: number = 0;
  initialClick = false;
  selectedItemId:any;
  selectedItem:any;
  loading = false;
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
    private dynamicService: DynamicFormService,
    private dialog: MatDialog
  ) {
    super(dynamicService);
    //this._control = _defaultSelect;
  }
  ngOnDestroy(): void {
    this.subscriptions.forEach((item) => item.unsubscribe());
    this.onDestroy();
  }
  ngOnInit(): void {
    this.setFormControl(this.injector);
    this.onValueChange();
    this.subscriptions.push(
      this.dataPopulation$.subscribe((items) => {
        this.filteredSource = items;
        if(!this.selectedItem && this.selectedItemId){
          this.selectedItem = items.find((item:any)=>item.id === this.selectedItemId);
        }
        if (this.dialogReference) {
          this.dialogReference.componentInstance.upDatedData({
            value: items,
            total: this.count,
            selectedItem:this.selectedItem
          });
        }
        else
        {
        this.totalCount = this.count
        }
        this.loading = false;
        if (this.totalCount > this.pageSize && !this.dialogReference) {
          this.openPopup();
        }
      })
    );
  }

  onValueChange() {
    const lookupControl = this._control as LookupSelectControl;
    this.subscriptions.push(
      this.getValueChangedObservable().subscribe((value) => {
        if (
          lookupControl.data.api &&
          !lookupControl.data.api?.onLoad &&
          value &&
          !this.initialClick
        ) {
          let option = { [lookupControl.valueProp as string]: value };
          for (let key of this.dynamicFormService.getExtraData().keys()) {
            if (key.startsWith(this._control.name)) {
              option[key.replace(`${this._control.name}_`, "")] =
                this.dynamicFormService.getExtraData().get(key);
            }
          }
          this.populateSelectedSourceOnly(option);
        }
      })
    );
  }

  onClearClick(): void {
    this.value = "";
  }

  onNavigateClick(): void {
    const lookupControl = this._control as LookupSelectControl;

    const event: EventElement = {
      data: lookupControl.eventValue,
      type: lookupControl.eventType,
      value: this.value,
    };
    this.dynamicService.publishEvent(event);
  }

  filterSource(text: string) {
    const lookupControl = this._control as LookupSelectControl;
    const props = lookupControl.displayProp?.split("|") || [];
    this.filteredSource = this.source.filter((item) => {
      let retValue = false;
      props.forEach((name) => {
        if (item.hasOwnProperty(name)) {
          let value = item[name] || "";
          retValue =
            retValue ||
            value.toString().toLowerCase().indexOf(text.toLowerCase().trim()) !=
              -1;
        }
      });
      return retValue;
    });
  }

  onClick() {
    if (!this.initialClick) {
      this.loading = true;
      this.initialClick = true;
      this.selectedItemId = this.source.length > 0 ? this.source[0].id : null;
      this.source = [];
      this.populateSourceOnDemand();
    }
  }

  private _initControlData(selectControl: GenericControl) {
    const lookupControl = selectControl as LookupSelectControl;
    this.pageSize = lookupControl.pageSize
      ? lookupControl.pageSize
      : this.pageSize;
    this.populateSource();
    this.addRule(selectControl.rule);
    this.setControlAccess();
  }

  public getSelectedDisplayProp() {
    this.lookupDataId !== this.value ? (this.displayValue = "") : "";
    if (this.displayValue == "") {
      const lookupControl = this._control as LookupSelectControl;
      const props = lookupControl.displayProp?.split("|") || [];
      const option: any = {};
      for (let key of this.dynamicFormService.getExtraData().keys()) {
        if (key.startsWith(this._control.name)) {
          option[key.replace(`${this._control.name}_`, "")] =
            this.dynamicFormService.getExtraData().get(key);
        }
      }
      return props.reduce((prev, cur) => {
        return this.value === '' ? "--Select--" : prev === "-##"
          ? option[cur]
          : this.value === '' ? "--Select--" : `${prev == null ? " " : prev} ${this.renderDataWithCurlyBrace(
              option[cur]
            )}`;
      }, "-##");
    } else {
      return this.displayValue;
    }
  }

  public getDisplayProp(option: any) {
    const lookupControl = this._control as LookupSelectControl;
    const props = lookupControl.displayProp?.split("|") || [];
    return props.reduce((prev, cur) => {
      return prev === "-##"
        ? option[cur]
        : `${prev == null ? "" : prev} ${this.renderDataWithCurlyBrace(
            option[cur]
          )}`;
    }, "-##");
  }
  openPopup(): void {
    const lookup=this._control as LookupSelectControl  
    const dialogRef = this.dialog.open(LookupDialogComponent, {
      width: "700px",
      height: "620px",
      data: {
        value: this.source,
        total: this.totalCount,
        pageSize: this.pageSize,
        selectedItem:this.selectedItem,
        lookupId:lookup.eventValue,
      },
      hasBackdrop: false,
    });
    this.dialogReference = dialogRef;

    dialogRef.afterClosed().subscribe(({ data }: any) => {
      this.selectedItem = data;
      const lookupControl = this._control as LookupSelectControl;
      this.writeValue(data.id);
      this.lookupDataId = data.id;
      this.displayValue = this.getDisplayProp(data);
      this.dialogReference = null;
    });
    dialogRef.componentInstance.dialogEvent$.subscribe((event: any) => {
      this.nextPage(event.pageNumber, dialogRef, this.pageSize, event.filters);
    });
  }

  nextPage(
    pageNumber: number = 0,
    dialogRef: any,
    pageSize: number,
    filters: any
  ) {
    let controlData = this.control as DataControl;
    const [id] = controlData.data.api?.params;
    controlData.data.api &&
      (controlData.data.api.params = [id, pageNumber, pageSize, filters]);
      this.source = [];
      this.populateSourceOnDemand();
  }

  private renderDataWithCurlyBrace(data: any) {
    return data == null ? "" : "{" + data + "}";
  }
}
