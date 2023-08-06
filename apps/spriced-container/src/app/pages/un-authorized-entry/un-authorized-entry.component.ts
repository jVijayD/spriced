import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { OneColComponent } from "@spriced-frontend/spriced-ui-lib";
import { MatIconModule } from "@angular/material/icon";

@Component({
  selector: "sp-un-authorized-entry",
  standalone: true,
  imports: [CommonModule,OneColComponent,MatIconModule],
  template: `<sp-one-col>
  <div
    class="flex flex-col items-center justify-center space-y-5 w-full h-full"
  >
    <mat-icon class="icon">error</mat-icon>
    <label class="text-2xl text-secondary-dark">Unauthorized access.</label>
  </div>
</sp-one-col>`,
  styles: [`.icon {
    font-size: 5rem;
    width: 5rem;
    height: 5rem;
    @apply text-warn-default;
  }
  `,]
})
export class UnAuthorizedEntryComponent {}
