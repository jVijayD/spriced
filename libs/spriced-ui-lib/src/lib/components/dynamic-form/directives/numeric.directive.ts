import { Directive, ElementRef, HostListener, Input } from "@angular/core";

@Directive({
  selector: "[spNumeric]",
})
export class NumericDirective {
  @Input() decimals = 0;

  private check(value: string) {
    if (this.decimals <= 0) {
      return String(value).match(new RegExp(/^(-?\d*)$/));
    } else {
      const regExpString =
        "^\\s*((\\d+(\\.\\d{0," +
        this.decimals +
        "})?)|((\\d*(\\.\\d{1," +
        this.decimals +
        "}))))\\s*$";
      return String(value).match(new RegExp(regExpString));
    }
  }

  private run(oldValue: string) {
    setTimeout(() => {
      const currentValue = this.el.nativeElement.value;
      if (currentValue !== "" && !this.check(currentValue)) {
        this.el.nativeElement.value = oldValue;
      }
    });
  }

  constructor(private el: ElementRef) {}

  @HostListener("keydown", ["$event"])
  onKeyDown(event: KeyboardEvent) {
    if (
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
