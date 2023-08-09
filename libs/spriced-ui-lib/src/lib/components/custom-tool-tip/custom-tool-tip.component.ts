import { CommonModule } from '@angular/common';
import { Component, Input, TemplateRef } from '@angular/core';
import { ToolTipRendererDirective } from '../directive/tool-tip-renderer.directive';
import { DataGridComponent } from '../data-grid/data-grid.component';

@Component({
  selector: 'sp-custom-tool-tip',
  standalone: true,
  imports: [CommonModule, CustomToolTipComponent, ToolTipRendererDirective, DataGridComponent],
  templateUrl: './custom-tool-tip.component.html',
  styleUrls: ['./custom-tool-tip.component.scss'],
})
export class CustomToolTipComponent {
  
  /**
   * This is simple text which is to be shown in the tooltip
   */
  @Input() text!: string;

  /**
   * This provides finer control on the content to be visible on the tooltip
   * This template will be injected in McToolTipRenderer directive in the consumer template
   * <ng-template #template>
   *  content.....
   * </ng-template>
   */
  @Input() contentTemplate!: TemplateRef<any>;
}
