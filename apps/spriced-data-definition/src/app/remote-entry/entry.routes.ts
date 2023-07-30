import { Route } from "@angular/router";
import { ModelComponent } from "../pages/model/model.component";
import { EntityComponent } from "../pages/entity/entity.component";
import { ModelListComponent } from "../pages/model-list/model-list.component";

export const remoteRoutes: Route[] = [
  { path: "model", component: ModelComponent },
  { path: "entity", component: EntityComponent },
  { path: "model-list", component: ModelListComponent },
];
