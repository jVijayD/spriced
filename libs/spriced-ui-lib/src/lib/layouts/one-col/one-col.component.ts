import { ChangeDetectionStrategy, Component } from "@angular/core";
import { CommonModule } from "@angular/common";

@Component({
  selector: "sp-one-col",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./one-col.component.html",
  styleUrls: ["./one-col.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OneColComponent {}
