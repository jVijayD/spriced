import { Route } from "@angular/router";
import { HomeComponent } from "../pages/home/home.component";
import { AppComponent } from "../app.component";
import { ReportComponent } from "../pages/report/report.component";

export const remoteRoutes: Route[] = [
  {
    path: "",
    component: AppComponent,
    children: [
      //{ path: "", component: HomeComponent },
      {
        path: ":groupId",
        component: HomeComponent,
      },
      {
        path: "report/:dashboardId",
        component: ReportComponent,
      },
    ],
  },
];
