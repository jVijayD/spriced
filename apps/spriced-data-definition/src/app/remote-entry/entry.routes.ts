import { Route } from "@angular/router";
import { ModelComponent } from "../pages/model/model.component";
import { EntityComponent } from "../pages/entity/entity.component";

export const remoteRoutes: Route[] = [
  { path: "model", component: ModelComponent },
  { path: "entity", component: EntityComponent },
];
