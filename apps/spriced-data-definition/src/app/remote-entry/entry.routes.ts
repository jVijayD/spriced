import { Route } from "@angular/router";
import { ModelComponent } from "../pages/model/model.component";
import { EntityComponent } from "../pages/entity/entity.component";
import { ModelListComponent } from "../pages/model-list/model-list.component";
import { AppComponent } from "../app.component";
import { ModelAccessComponent } from "../pages/model-access/model-access.component";

export const remoteRoutes: Route[] = [
  {
    path: "",
    component: AppComponent,
    children: [
      { path: "", component: ModelComponent  },
      { path: "model", component: ModelComponent },
      { path: "entity", component: EntityComponent },
      { path: "model-list", component: ModelListComponent },
      { path: "model-access", component: ModelAccessComponent },
      { path: "rules", loadChildren: () => import('../business-rules/business-rules.module').then( m => m.BusinessRulesModule)}
    ],
  },
];
