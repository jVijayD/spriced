import { CommonModule } from "@angular/common";
import { Component, Input, OnDestroy } from "@angular/core";
import { MatIconModule } from "@angular/material/icon";
import { AppDataService } from "@spriced-frontend/spriced-common-lib";
import { Subscription } from "rxjs";
import { StatusPanelComponent } from "../status-panel/status-panel.component";
@Component({
  selector: "sp-footer",

  templateUrl: "./footer.component.html",
  styleUrls: ["./footer.component.scss"],
  standalone: true,
  imports: [CommonModule, MatIconModule, StatusPanelComponent],
})
export class FooterComponent implements OnDestroy {
  network = true;
  subscription: Subscription[] = [];
  constructor(public appDataService: AppDataService) {
    this.subscription.push(
      this.appDataService.networkStatus$.subscribe((item) => {
        this.network = item;
      })
    );
  }
  ngOnDestroy(): void {
    this.subscription.forEach((item) => item.unsubscribe());
  }
}
