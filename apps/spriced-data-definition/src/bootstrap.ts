import { importProvidersFrom } from "@angular/core";
import { bootstrapApplication } from "@angular/platform-browser";
import { SharedSpricedSharedLibModule } from "@spriced-frontend/shared/spriced-shared-lib";
import { RouterModule } from "@angular/router";
import { appRoutes } from "./app/app.routes";
import { ModelComponent } from "./app/pages/model/model.component";
//import { AppComponent } from "./app/app.component";

bootstrapApplication(ModelComponent, {
  providers: [
    importProvidersFrom(SharedSpricedSharedLibModule),
    importProvidersFrom(
      RouterModule.forRoot(appRoutes, { initialNavigation: "enabledBlocking" })
    ),
  ],
});
