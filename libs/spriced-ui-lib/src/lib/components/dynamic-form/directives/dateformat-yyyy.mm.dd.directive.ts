import { Directive } from "@angular/core";
import { MAT_DATE_FORMATS } from "@angular/material/core";

const FORMAT = {
  parse: {
    dateInput: "YYYY.MM.dd",
  },
  display: {
    dateInput: "YYYY.MM.dd",
    monthYearLabel: "MMM YYYY",
    dateA11yLabel: "LL",
    monthYearA11yLabel: "MMMM YYYY",
  },
};
@Directive({
  selector: "[spDateFormatYYYY_MM_dd]",
  providers: [{ provide: MAT_DATE_FORMATS, useFactory: () => FORMAT }],
})
export class DateFormatDirectiveYYYY_MM_dd {}
