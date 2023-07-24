import { Directive } from "@angular/core";
import { MAT_DATE_FORMATS } from "@angular/material/core";

const FORMAT = {
  parse: {
    dateInput: "YY.MM.dd",
  },
  display: {
    dateInput: "YY.MM.dd",
    monthYearLabel: "MMM YYYY",
    dateA11yLabel: "LL",
    monthYearA11yLabel: "MMMM YYYY",
  },
};
@Directive({
  selector: "[spDateFormatYY_MM_dd]",
  providers: [{ provide: MAT_DATE_FORMATS, useValue: FORMAT }],
})
export class DateFormatDirectiveYY_MM_dd {}
