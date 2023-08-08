import { Route } from "@angular/router";
import { HomeComponent } from "../pages/home/home.component";
import { AppComponent } from "../app.component";

export const remoteRoutes: Route[] = [
  {
    path: "",
    component: AppComponent,
    children: [
      { path: "", component: HomeComponent },
      { path: ":dashboardId", component: HomeComponent },
    ],
  },
];
