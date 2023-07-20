import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'sp-two-col-three-forth',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './two-col-three-forth.component.html',
  styleUrls: ['./two-col-three-forth.component.scss'],
})
export class TwoColThreeForthComponent {
  @Input()
  singleColumn = false;
}
