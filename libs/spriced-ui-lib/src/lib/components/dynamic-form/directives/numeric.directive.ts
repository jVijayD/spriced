import { Directive, ElementRef, EventEmitter, HostListener, Input, Output } from "@angular/core";

@Directive({
  selector: "[spNumeric]",
})
export class NumericDirective {
  @Input() decimals = 0;
  @Output() value: EventEmitter<any> = new EventEmitter<any>();

  private check(value: string) {
    if (this.decimals <= 0) {
      return String(value).match(new RegExp(/^(-?\d*)$/));
    } else {
      const regExpString =
        "^\\s*((-?\\d*(\\.\\d{0," +
        this.decimals +
        "})?)|((-?\\d*(\\.\\d{1," +
        this.decimals +
        "}))))\\s*$";
      return String(value).match(new RegExp(regExpString));
    }
  }

  private run(oldValue: string) {
    setTimeout(() => {
      // This regex check only numbers, decimal numbers and negative numbers.
      const validNumberRegex = new RegExp(/^-?\d*\.?\d*$/);
      const number = validNumberRegex.test(this.el.nativeElement.value);
      this.el.nativeElement.value = !number || (this.decimals === 0 && !this.check(this.el.nativeElement.value)) ? oldValue : this.el.nativeElement.value;

      // Handle this when user enter 9 number 16th times then last digit change with subtract 1
      const val = this.el.nativeElement.value;
      if (val.length == 16 && val[val.length - 1] === '9') {
        // Find the index of the last occurrence of '9'
        const lastIndex = val.lastIndexOf('9');

        // If '9' is found, replace it with '8'
        if (lastIndex !== -1) {
          this.el.nativeElement.value = val.substring(0, lastIndex) + '8' + val.substring(lastIndex + 1);
        }
      }
      
      this.value.emit(this.el.nativeElement.value);
      // const currentValue = this.el.nativeElement.value;  
      // if (currentValue !== "" && !this.check(currentValue)) {
      //   // this.el.nativeElement.value = oldValue;
      //   //(this.el.nativeElement as HTMLInputElement).value = oldValue;
      // }
    });
  }

  constructor(private el: ElementRef) {}

  @HostListener("keydown", ["$event"])
  onKeyDown(event: KeyboardEvent) {
    let decimalCount = 0;
    const val = this.el.nativeElement.value.split(".");
    if (val.length > 1) {
      decimalCount = val[1].length;
    }
    if (!(event.ctrlKey && event.key === 'v') && 
      [
        "0",
        "1",
        "2",
        "3",
        "4",
        "5",
        "6",
        "7",
        "8",
        "9",
        "Backspace",
        "",
        " ",
        "Enter",
        ".",
        "-",
        "ArrowLeft",
        "ArrowRight",
      ].indexOf(event.key) === -1
    ) {
      event.preventDefault();
    }

    this.run(this.el.nativeElement.value);
  }

  @HostListener("paste", ["$event"])
  onPaste(event: ClipboardEvent) {
    this.run(this.el.nativeElement.value);
  }
}
