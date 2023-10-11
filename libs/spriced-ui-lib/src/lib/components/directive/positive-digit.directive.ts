import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[spPositiveDigit]',
  standalone:true
})
export class PositiveDigitDirective {
  constructor(private el:ElementRef) { }
  allowedKeypress = [8,13,37,39,46,38,40];
  @Input() public SelectedValue:number=1;
  @HostListener('keydown',['$event'])
   
  onKeyDown(e:any){
      if ((this.allowedKeypress.includes(e.which))||(e.which > 47 && e.which < 58 && e.target.value.length < this.SelectedValue)) 
      {
          //if (e.target.value < 0 || e.target.value > 99) {
               // e.preventDefault();
              //}
      } 
      else {
        e.preventDefault();
      }

    }
}
