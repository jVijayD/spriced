import { Component, EventEmitter, Input, Output } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";

@Component({
  selector: "sp-header-action",
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule],
  templateUrl: "./header-action.component.html",
  styleUrls: ["./header-action.component.scss"],
})
export class HeaderActionComponent {
  @Input()
  icon!: string;

  @Input()
  text!: string;

  @Input()
  title!: string;

  @Input()
  disabled = false;

  @Output()
  actionClick: EventEmitter<void> = new EventEmitter<void>();

  onClick() {
    this.actionClick.emit();
  }
}
