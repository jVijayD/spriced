import { Component, OnDestroy, OnInit } from "@angular/core";
import { NavigationStart, Router, RouterModule } from "@angular/router";
import { LoaderComponent} from "@spriced-frontend/spriced-ui-lib";
import { HeaderComponent } from "./components/header/header.component";
import { SidebarComponent } from "./components/sidebar/sidebar.component";
import { BodyComponent } from "./components/body/body.component";
import { FooterComponent } from "./components/footer/footer.component";
import { CommonModule } from "@angular/common";
import {
  AppDataService,
  Application,
  MenuItem,
} from "@spriced-frontend/shared/spriced-shared-lib";
import { Subscription } from "rxjs";
import { GlobalSettingService } from "@spriced-frontend/spriced-common-lib";
import * as moment from "moment-timezone";

@Component({
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    LoaderComponent,
    HeaderComponent,
    SidebarComponent,
    BodyComponent,
    FooterComponent,
  ],
  selector: "sp-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
})
export class AppComponent implements OnDestroy, OnInit {
  title = "Spriced";
  currentAppName: any = "Spriced";
  path = location.pathname;
  subscriptions: Subscription[] = [];
  sidebarData: Application[] = [];
  isSideNavCollapsed = false;
  screenWidth = 0;
  menuData: MenuItem[] = [];
  onToggleSideNav(data: any): void {
    this.screenWidth = data.screenWidth;
    this.isSideNavCollapsed = data.collapsed;
  }
  changeOfRoutes() {
    this.path = location.pathname;
  }

  constructor(
    public appDataService: AppDataService,
    private router: Router,
    private settings:GlobalSettingService
  ) {
    this.subscriptions.push(
      this.appDataService.menuData$.subscribe((menuItems) => {
        this.menuData = [...menuItems];
      })
    );

    this.subscriptions.push(
      this.router.events.subscribe((event) => {
        if (event instanceof NavigationStart) {
          this.appDataService.setErrors([]);
        }
      })
    );
    this.subscriptions.push(
      this.appDataService.getApps().subscribe((appsList) => {
        let appsAry = appsList?.map((a) => a as Application);
        this.sidebarData = appsAry?appsAry:[];
      })
    );
  }
  ngOnInit(): void {
    this.init();
    this.subscriptions.push(
      this.settings.getGlobalSettings().subscribe((res:any) => {
        if(res.settingsData?.timezone!==null)
          {
            this.settings.setTimezone(res.settingsData?.timezone)
          }
      })
    );
  }
  ngOnDestroy(): void {
    this.subscriptions.forEach((item) => item.unsubscribe());
  }

  init() {
    this.appDataService.setNetworkAccessData();
  }
}
