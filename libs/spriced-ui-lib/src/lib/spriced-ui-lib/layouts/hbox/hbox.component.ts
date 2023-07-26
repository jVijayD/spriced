import { CommonModule } from "@angular/common";
import { Component, Input } from "@angular/core";

@Component({
  selector: "sp-hbox",
  template: `<div
    class="flex flex-row w-11/12"
    [ngClass]="[
      noGap ? '' : 'gap-x-5',
      noMarginX ? '' : 'm-x-5',
      marginY ? 'm-y-5' : ''
    ]"
  >
    <ng-content></ng-content>
  </div>`,
  standalone: true,
  imports: [CommonModule],
})
export class HboxComponent {
  @Input()
  noGap: any;
  @Input()
  marginY: any;
  @Input()
  noMarginX: any;
}
