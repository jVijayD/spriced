import {
  Component,
  EventEmitter,
  Input,
  Output,
  ViewEncapsulation,
} from "@angular/core";
import { CommonModule } from "@angular/common";
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";
import { MatMenuModule } from "@angular/material/menu";

@Component({
  selector: "sp-header-action",
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule, MatMenuModule],
  templateUrl: "./header-action.component.html",
  styleUrls: ["./header-action.component.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class HeaderActionComponent {
  @Input()
  context = false;

  @Input()
  icon!: string;

  @Input()
  text!: string;

  @Input()
  title!: string;

  @Input()
  disabled = false;

  @Input()
  selected = false;

  @Input()
  showText = false;

  @Output()
  actionClick: EventEmitter<void> = new EventEmitter<void>();

  onClick() {
    this.actionClick.emit();
  }
}
