import { Directive } from "@angular/core";
import { MAT_DATE_FORMATS } from "@angular/material/core";

const FORMAT = {
  parse: {
    dateInput: "dd-MM-YY",
  },
  display: {
    dateInput: "dd-MM-YY",
    monthYearLabel: "MMM YYYY",
    dateA11yLabel: "LL",
    monthYearA11yLabel: "MMMM YYYY",
  },
};
@Directive({
  selector: "[spDateFormatdd__MM__YY]",
  providers: [{ provide: MAT_DATE_FORMATS, useValue: FORMAT }],
})
export class DateFormatDirectivedd__MM__YY {}
