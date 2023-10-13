import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[spPositiveDigit]',
  standalone:true
})
export class PositiveDigitDirective {
  constructor(private el:ElementRef) { }
  allowedKeypress = [8,13,37,39,38,40];
  @Input() public SelectedValue:number=1;
  @HostListener('keypress',['$event'])
   
  onKeyDown(e:any){
    if ((!this.allowedKeypress.includes(e.which)) && !(e.which >= 47 && e.which <= 58) || e.target.value.length >=this.SelectedValue) 
    {
          e.preventDefault();
    }
  }
}
