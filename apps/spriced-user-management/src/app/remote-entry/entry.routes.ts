import { Route } from "@angular/router";
import { AppAccessComponent } from "../pages/app-access/app-access.component";
import { AppComponent } from "../app.component";

export const remoteRoutes: Route[] = [
  {
    path: "",
    component: AppComponent,
    children: [
      { path: "app-access", component: AppAccessComponent }
    ],
  },
];
