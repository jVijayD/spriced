import { Directive } from "@angular/core";
import { MAT_DATE_FORMATS } from "@angular/material/core";

const FORMAT = {
  parse: {
    dateInput: "DD-MM-YYYY",
  },
  display: {
    dateInput: "DD-MM-YYYY",
    monthYearLabel: "MMM YYYY",
    dateA11yLabel: "LL",
    monthYearA11yLabel: "MMMM YYYY",
  },
};
@Directive({
  selector: "[spDateFormatDD__MM__YYYY]",
  providers: [{ provide: MAT_DATE_FORMATS, useValue: FORMAT }],
})
export class DateFormatDirectiveDD__MM__YYYY {}
