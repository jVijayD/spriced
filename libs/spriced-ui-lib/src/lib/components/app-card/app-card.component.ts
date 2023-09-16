import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'sp-app-card',
  standalone: true,
  templateUrl: './app-card.component.html',
  styleUrls: ['./app-card.component.css'],
  imports: [CommonModule,RouterModule,MatIconModule],
})

export class AppCardComponent {
@Input() path:any;
@Input() image:any;
@Input() header:any;
@Input() paragraph:any;
}
