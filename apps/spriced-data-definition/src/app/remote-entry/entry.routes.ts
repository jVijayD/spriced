import { Route } from "@angular/router";
import { ModelComponent } from "../pages/model/model.component";
import { EntityComponent } from "../pages/entity/entity.component";
import { ModelListComponent } from "../pages/model-list/model-list.component";
import { AppComponent } from "../app.component";
import { ModelAccessComponent } from "../pages/model-access/model-access.component";
import { AppAccessComponent } from "../pages/app-access/app-access.component";
import { ViewTransactionsAdminComponent } from "../pages/view-Transactions/viewTransactions-admin/view-transactions-admin.component";
import { HierarchyDefinitionComponent } from "../pages/hierarchy-definition/hierarchy-definition.component";

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
      { path: "app-access", component: AppAccessComponent },
      { path: "view-transactions" , component: ViewTransactionsAdminComponent},
      { path: "hierarchy-definition", component: HierarchyDefinitionComponent },
      { path: "rules", loadChildren: () => import('../business-rules/business-rules.module').then( m => m.BusinessRulesModule)}
    ],
  },
];
