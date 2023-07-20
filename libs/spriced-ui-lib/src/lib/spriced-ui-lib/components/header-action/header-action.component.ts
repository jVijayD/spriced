import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'sp-header-action',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './header-action.component.html',
  styleUrls: ['./header-action.component.scss'],
})
export class HeaderActionComponent {
  @Input()
  icon!: string;

  @Input()
  text!: string;

  @Input()
  title!: string;

  @Output()
  actionClick: EventEmitter<void> = new EventEmitter<void>();

  onClick() {
    this.actionClick.emit();
  }
}
