import {
  AfterContentChecked,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
} from "@angular/core";
import { CommonModule } from "@angular/common";
import {
  AppDataService,
  MenuItem,
} from "@spriced-frontend/shared/spriced-shared-lib";
import { Router, RouterOutlet } from "@angular/router";
import { Subscription, of } from "rxjs";
import { LoaderService } from "@spriced-frontend/spriced-ui-lib";

@Component({
  selector: "sp-app",
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  template: `<router-outlet></router-outlet>`,
  styles: [],
})
export class AppComponent implements OnInit, OnDestroy, AfterContentChecked {
  //menuItems: MenuItem[] = [];
  subscriptions: Subscription[] = [];
  constructor(
    private appDataService: AppDataService,
    private loaderService: LoaderService,
    private router: Router,
    private ref: ChangeDetectorRef
  ) {}

  ngAfterContentChecked() {
    this.ref.detectChanges();
  }

  ngOnInit(): void {
    this.appDataService.setMenuData([]);
    this.loaderService.show();
    this.subscriptions.push(
      of([
        {
          name: "Dn-Pricing Entity Audit",
          path: "/spriced-reports/ebe77ed2-3309-4fd4-b59b-6c08070faa02",
          active: true,
        },
        {
          name: "EBU CTT Part Price Comparison",
          path: "/spriced-reports/631dcfd9-9f0b-4fdb-ad5b-8a2b6c71fbe5",
          //path: "/spriced-user-management",
          active: false,
        },
        {
          name: "Price History",
          path: "/spriced-reports/4dad7019-aa49-4784-ac60-73aea5f2a9dc",
          active: false,
        },
      ]).subscribe({
        next: (menuItems) => {
          this.appDataService.setMenuData(menuItems);
          this.loaderService.hide();
          this.router.navigate([
            "/spriced-reports/ebe77ed2-3309-4fd4-b59b-6c08070faa02",
          ]);
        },
        error: (err) => {
          this.loaderService.hide();
        },
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => {
      subscription.unsubscribe();
    });
  }
}
