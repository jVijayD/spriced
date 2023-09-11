import { Route } from "@angular/router";
import { AppComponent } from "../app.component";
import { HomeComponent } from "../pages/home/home.component";

export const remoteRoutes: Route[] = [
  {
    path: "",
    component: AppComponent,
    children: [
      { path: "", component: HomeComponent },
      { path: "item2", component: HomeComponent },
      { path: "item3", component: HomeComponent },
    ],
  },
];
