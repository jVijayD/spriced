import { APP_INITIALIZER, ApplicationConfig } from '@angular/core';
import {
  provideAnimations,
  provideNoopAnimations,
} from '@angular/platform-browser/animations';
import {
  provideRouter,
  withEnabledBlockingInitialNavigation,
} from '@angular/router';
import { appRoutes } from './app.routes';
import { LoaderService } from '@spriced-frontend/spriced-ui-lib';
// import { HTTP_INTERCEPTORS } from '@angular/common/http';
// import { KeycloakService } from 'keycloak-angular';
// import { initializeKeycloak } from './core/init/keycloak-init.factory';
// import { KeycloakBearerInterceptor } from './core/interceptors/keycloakInterceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(appRoutes, withEnabledBlockingInitialNavigation()),
    provideAnimations(),
    provideNoopAnimations(),
    LoaderService,
    // {
    //   provide: HTTP_INTERCEPTORS,
    //   useClass: KeycloakBearerInterceptor,
    //   multi: true,
    // },
    // {
    //   provide: APP_INITIALIZER,
    //   useFactory: initializeKeycloak,
    //   multi: true,
    //   deps: [KeycloakService],
    // },
  ],
};
