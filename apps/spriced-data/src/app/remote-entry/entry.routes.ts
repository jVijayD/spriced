import { Route } from "@angular/router";
import { EntityDataComponent } from "../pages/entity-data/entity-data.component";
import { AppComponent } from "../app.component";

export const remoteRoutes: Route[] = [
  {
    path: "",
    component: AppComponent,
    children: [
      { path: "", component: EntityDataComponent },
      { path: ":modelId/:entityId", component: EntityDataComponent },
      { path: "lookup/:id", component: EntityDataComponent },
    ],
  },
];
