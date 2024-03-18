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
          name: "NRP Reports",
          path: "/spriced-reports/1",
          active: true,
        },
        // {
        //   name: "Group 2",
        //   path: "/spriced-reports/2",
        //   //path: "/spriced-user-management",
        //   active: false,
        // },
        // {
        //   name: "Group 3",
        //   path: "/spriced-reports/3",
        //   active: false,
        // },
      ]).subscribe({
        next: (menuItems) => {
          this.appDataService.setMenuData(menuItems);
          this.loaderService.hide();
          // this.router.navigate(["/spriced-reports/1"]);
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
