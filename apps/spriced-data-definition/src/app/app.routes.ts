import { Route } from "@angular/router";
import { AppCardComponent } from "@spriced-frontend/spriced-ui-lib";
export const appRoutes: Route[] = [
  {
    path: "",
    loadChildren: () =>
      import("./remote-entry/entry.routes").then((m) => m.remoteRoutes),
  },
];
