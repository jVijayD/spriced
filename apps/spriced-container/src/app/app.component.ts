import { Component } from "@angular/core";
import { RouterModule } from "@angular/router";
import { LoaderComponent } from "@spriced-frontend/spriced-ui-lib";

@Component({
  standalone: true,
  imports: [RouterModule, LoaderComponent],
  providers: [],
  selector: "sp-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
})
export class AppComponent {
  title = "Spriced";
  constructor() {}
}
