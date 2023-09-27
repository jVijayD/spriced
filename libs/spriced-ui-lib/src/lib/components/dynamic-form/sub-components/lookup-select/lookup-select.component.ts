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
import { DataControl, GenericControl, LookupSelectControl } from "../../dynamic-form.types";
import {
  DynamicFormService,
  EventElement,
} from "../../service/dynamic-form.service";
import { NG_VALUE_ACCESSOR } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { LookupDialogComponent } from "./lookup-dialog/lookup-dialog/lookup-dialog.component";

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
  public prop:string = 'code|name';
  maxCount:number = 30;
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
    this.onDestroy();
  }
  ngOnInit(): void {
    this.setFormControl(this.injector);
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

  onClick() {
    //this.populateSourceOnDemand();
  }

  private _initControlData(selectControl: GenericControl) {
    this.populateSource();
    this.addRule(selectControl.rule);
    this.setControlAccess();
  }

  public getSelectedDisplayProp() {
    const lookupControl = this._control as LookupSelectControl;
    const props = this.prop.split("|") || [];
    const option: any = {};
    for (let key of this.dynamicFormService.getExtraData().keys()) {
      if (key.startsWith(this._control.name)) {
        option[key.replace(`${this._control.name}_`, "")] =
          this.dynamicFormService.getExtraData().get(key);
      }
    }
    return props.reduce((prev, cur) => {
      return prev === "-##"
        ? option[cur]
        : `${prev == null ? "" : prev} ${this.renderDataWithCurlyBrace(
            option[cur]
          )}`;
    }, "-##");
  }

  public getDisplayProp(option: any, prop: string) {
    //let displayProp = "";
    const props = prop.split("|");
    //displayProp = props.map((item) => option[item]).join(" | ");

    return props.reduce((prev, cur) => {
      return prev === "-##"
        ? option[cur]
        : `${prev == null ? "" : prev} ${this.renderDataWithCurlyBrace(
            option[cur]
          )}`;
    }, "-##");
    //return displayProp;
  }
  openPopup(): void {
    const dialogRef = this.dialog.open(LookupDialogComponent, {
      width: '700px',
      height: '620px',
      data:{value:this.source,total:this.count},
      // hasBackdrop:false
    });

    dialogRef.afterClosed().subscribe(({data}:any) => {
     this.writeValue(data.id);
    //  this.displayValue = this.getSelectedDisplayProp();
    });
    dialogRef.componentInstance.dialogEvent$.subscribe((pageNumber:any) => {
    this.nextSet(pageNumber);
    setTimeout(()=>{
      dialogRef.componentInstance.upDatedData({ value: this.source, total: this.count });
    },100);
  })
  }
  
   nextSet(pageNumber:number=0){
    let controlData = this.control as DataControl;
    const [id]  = controlData.data.api?.params;
    controlData.data.api && (controlData.data.api.params = [id, pageNumber]);
    this.populateSource();
   }
  private renderDataWithCurlyBrace(data: any) {
    return data == null ? "" : "{" + data + "}";
  }
}
