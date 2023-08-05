import { Component, OnDestroy, OnInit } from "@angular/core";
import { RouterModule } from "@angular/router";
import { LoaderComponent } from "@spriced-frontend/spriced-ui-lib";
import { HeaderComponent } from "./components/header/header.component";
import { SidebarComponent } from "./components/sidebar/sidebar.component";
import { BodyComponent } from "./components/body/body.component";
import { FooterComponent } from "./components/footer/footer.component";
import { CommonModule } from "@angular/common";
import {
  AppDataService,
  MenuItem,
} from "@spriced-frontend/shared/spriced-shared-lib";
import { Subscription } from "rxjs";

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
  sidebarData = [
    {
      name: "Data Definition",
      icon: "/assets/images/definition.png",
      path: "/spriced-data-definition/model",
    },
    {
      name: "Data Access",
      icon: "/assets/images/access.png",
      path: "/spriced-data",
    },
    {
      name: "Reporting",
      icon: "/assets/images/reporting.png",
      path: "/spriced-reports",
    },
  ];
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

  constructor(public appDataService: AppDataService) {
    this.subscriptions.push(
      this.appDataService.menuData$.subscribe((menuItems) => {
        this.menuData = [...menuItems];
      })
    );
  }
  ngOnInit(): void {
    this.init();
  }
  ngOnDestroy(): void {
    this.subscriptions.forEach((item) => item.unsubscribe());
  }

  init() {
    this.appDataService.setNetworkAccessData();
  }
}
