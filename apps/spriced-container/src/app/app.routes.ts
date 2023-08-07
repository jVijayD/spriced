import { Route } from "@angular/router";
import { loadRemoteModule } from "@nx/angular/mf";
import { HomeComponent } from "./pages/home1/home.component";
import { PageNotFoundComponent } from "./pages/page-not-found/page-not-found/page-not-found.component";
import { LandingPageComponent } from "./pages/landingPage/landing-page.component";
import { AuthGuard } from "./guards/auth.guard";
import { UnAuthorizedEntryComponent } from "./pages/un-authorized-entry/un-authorized-entry.component";

export const appRoutes: Route[] = [
  {
    path: "spriced-user-management",
    loadChildren: () =>
      loadRemoteModule("spriced-user-management", "./Routes").then(
        (m) => m.remoteRoutes
      ),
    canActivate: [AuthGuard],
  },
  {
    path: "spriced-reports",
    loadChildren: () =>
      loadRemoteModule("spriced-reports", "./Routes").then(
        (m) => m.remoteRoutes
      ),
    canActivate: [AuthGuard],
  },
  {
    path: "spriced-data",
    loadChildren: () =>
      loadRemoteModule("spriced-data", "./Routes").then((m) => m.remoteRoutes),
    canActivate: [AuthGuard],
  },
  {
    path: "spriced-data-definition",
    loadChildren: () =>
      loadRemoteModule("spriced-data-definition", "./Routes").then(
        (m) => m.remoteRoutes
      ),
    canActivate: [AuthGuard],
  },
  {
    path: "home",
    component: HomeComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "",
    component: LandingPageComponent,
  },
  {
    path: "unauthorized",
    component: UnAuthorizedEntryComponent,
  },
  {
    path: "**",
    component: PageNotFoundComponent,
  },
];
