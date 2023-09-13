import { importProvidersFrom } from "@angular/core";
import { bootstrapApplication } from "@angular/platform-browser";
import { RouterModule } from "@angular/router";
import { appRoutes } from "./app/app.routes";
import { SharedSpricedSharedLibModule } from "@spriced-frontend/shared/spriced-shared-lib";
import { AppComponent } from "./app/app.component";

bootstrapApplication(AppComponent, {
  providers: [
    importProvidersFrom(SharedSpricedSharedLibModule),
    importProvidersFrom(
      RouterModule.forRoot(appRoutes, { initialNavigation: "enabledBlocking" })
    ),
  ],
});
