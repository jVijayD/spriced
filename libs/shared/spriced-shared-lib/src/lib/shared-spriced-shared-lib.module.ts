import { APP_INITIALIZER, NgModule, inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import { initializeKeycloak } from "./auth/keycloak-init.factory";
import { KeycloakAngularModule, KeycloakService } from "keycloak-angular";

@NgModule({
  imports: [CommonModule, KeycloakAngularModule],
  providers: [
    KeycloakService,
    {
      provide: APP_INITIALIZER,
      useFactory: initializeKeycloak,
      multi: true,
      deps: [KeycloakService],
    },
  ],
})
export class SharedSpricedSharedLibModule {}
