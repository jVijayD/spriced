import { Route } from "@angular/router";
import { AppComponent } from "../app.component";
import { HomeComponent } from "../pages/home/home.component";
import { AppAccessComponent } from "../pages/app-access/app-access.component";
export const remoteRoutes: Route[] = [
  {
    path: "",
    component: AppComponent,
    children: [
      { path: "app-access", component: AppAccessComponent },
      { path: "", component: AppAccessComponent },
    ],
  },
];
