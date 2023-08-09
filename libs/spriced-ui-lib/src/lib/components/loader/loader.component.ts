import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule, NgIf } from '@angular/common';
import { LoaderService } from './loader.service';

@Component({
  selector: 'sp-loader',
  standalone: true,
  imports: [CommonModule, NgIf],
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoaderComponent {
  constructor(public loaderService: LoaderService) {}
}
