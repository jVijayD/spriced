import { Directive, HostListener } from '@angular/core';

@Directive({
  selector: '[spPositiveDigit]',
  standalone:true
})
export class PositiveDigitDirective {

  constructor() { }
  allowedKeypress = [8,13,37,39,46,38,40]
  @HostListener('keydown',['$event'])
  onKeyDown(e:any){
 
      if(this.allowedKeypress.includes(e.which))
      {
        return;
      }
      else{
        if (e.which > 47 && e.which < 58 && e.target.value.length < 1) 
        {
            if (e.target.value < 0 || e.target.value > 10) {
                  e.preventDefault();
            }
        } 
        else {
          e.preventDefault();
        }
      }
 
  }

}
