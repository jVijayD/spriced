import { APP_INITIALIZER, NgModule, inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import { initializeKeycloak } from "./auth/keycloak-init.factory";
import { KeycloakAngularModule, KeycloakService } from "keycloak-angular";
import { AppDataService } from "./app-data/app-data.service";
import { StatusPannelService } from "./app-data/status-panel.service";
import { HTTP_INTERCEPTORS, HttpClientModule } from "@angular/common/http";
import { headerInterceptor } from "./auth/header-interceptor";

@NgModule({
  imports: [CommonModule, KeycloakAngularModule,HttpClientModule],
  providers: [
    KeycloakService,
    {
      provide: APP_INITIALIZER,
      useFactory: initializeKeycloak,
      multi: true,
      deps: [KeycloakService],
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: headerInterceptor,
      multi: true,
    },
    AppDataService,StatusPannelService
  ],
})
export class SharedSpricedSharedLibModule {}
