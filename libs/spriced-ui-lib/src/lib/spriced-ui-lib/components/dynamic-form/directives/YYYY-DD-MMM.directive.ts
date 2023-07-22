import { Directive } from "@angular/core";
import { MAT_DATE_FORMATS } from "@angular/material/core";

const FORMAT = {
  parse: {
    dateInput: "YYYY-DD-MMM",
  },
  display: {
    dateInput: "YYYY-DD-MMM",
    monthYearLabel: "MMM YYYY",
    dateA11yLabel: "LL",
    monthYearA11yLabel: "MMMM YYYY",
  },
};
@Directive({
  selector: "[spDateFormatYYYY__DD__MMM]",
  providers: [{ provide: MAT_DATE_FORMATS, useValue: FORMAT }],
})
export class DateFormatDirectiveYYYY__DD__MMM {}
