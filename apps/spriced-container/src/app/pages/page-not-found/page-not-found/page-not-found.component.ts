import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { OneColComponent } from "@spriced-frontend/spriced-ui-lib";
import { MatIconModule } from "@angular/material/icon";

@Component({
  selector: "sp-page-not-found",
  standalone: true,
  imports: [CommonModule, OneColComponent, MatIconModule],
  templateUrl: "./page-not-found.component.html",
  styleUrls: ["./page-not-found.component.scss"],
})
export class PageNotFoundComponent {}
