import { Route } from "@angular/router";
import { HomeComponent } from "../pages/home/home.component";
import { AppComponent } from "../app.component";
import { ReportComponent } from "../pages/report/report.component";
import { ReportFilterComponent } from "../pages/report-filter/report-filter.component";

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
        path: "",
        component: HomeComponent,
      },
      {
        path: "report/:dashboardId",
        component: ReportComponent,
      },
      {
        path: "report/:dashboardId/:quotedPriceId",
        component: ReportFilterComponent,
      },
    ],
  },
];
