import { importProvidersFrom } from "@angular/core";
import { bootstrapApplication } from "@angular/platform-browser";
import { RouterModule } from "@angular/router";
import { RemoteEntryComponent } from "./app/remote-entry/entry.component";
import { appRoutes } from "./app/app.routes";
import { SharedSpricedSharedLibModule } from "@spriced-frontend/shared/spriced-shared-lib";

bootstrapApplication(RemoteEntryComponent, {
  providers: [
    importProvidersFrom(SharedSpricedSharedLibModule),
    importProvidersFrom(
      RouterModule.forRoot(appRoutes, { initialNavigation: "enabledBlocking" })
    ),
  ],
});
