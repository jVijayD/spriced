import { CommonModule } from "@angular/common";
import { Component, Input } from "@angular/core";

@Component({
  selector: "sp-vbox",
  template: `
    <div
      class="flex flex-column"
      [ngClass]="[
        noGap ? '' : 'gap-y-5',
        noMarginY ? '' : 'm-y-5',
        marginX ? 'm-x-5' : ''
      ]"
    >
      <ng-content></ng-content>
    </div>
  `,
  standalone: true,
  imports: [CommonModule],
})
export class VboxComponent {
  @Input()
  noGap: boolean = false;
  @Input()
  noMarginY: boolean = false;
  @Input()
  marginX: boolean = false;
}
