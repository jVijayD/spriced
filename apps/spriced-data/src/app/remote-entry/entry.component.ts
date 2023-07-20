import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NxWelcomeComponent } from './nx-welcome.component';

@Component({
  standalone: true,
  imports: [CommonModule, NxWelcomeComponent],
  selector: 'sp-spriced-data-entry',
  template: `<sp-nx-welcome></sp-nx-welcome>`,
})
export class RemoteEntryComponent {}
