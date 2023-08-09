import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'sp-app-card',
  standalone: true,
  templateUrl: './app-card.component.html',
  styleUrls: ['./app-card.component.css'],
  imports: [CommonModule,RouterModule],
})

export class AppCardComponent {
@Input() path:any;
@Input() image:any;
@Input() header:any;
}
