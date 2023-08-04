import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { AppDataService } from "@spriced-frontend/shared/spriced-shared-lib";
import { RouterOutlet } from "@angular/router";

@Component({
  selector: "sp-app",
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  providers: [AppDataService],
  template: `<router-outlet></router-outlet>`,
  styles: [],
})
export class AppComponent {
  constructor(appDataService: AppDataService) {

  }
}
