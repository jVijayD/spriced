import { ApplicationConfig, importProvidersFrom } from "@angular/core";
import {
  provideAnimations,
  provideNoopAnimations,
} from "@angular/platform-browser/animations";
import {
  provideRouter,
  withEnabledBlockingInitialNavigation,
} from "@angular/router";
import { appRoutes } from "./app.routes";
import { LoaderService } from "@spriced-frontend/spriced-ui-lib";
import {
  KeycloakBearerInterceptor,
  SharedSpricedSharedLibModule,
} from "@spriced-frontend/shared/spriced-shared-lib";
import {
  HTTP_INTERCEPTORS,
  provideHttpClient,
  withInterceptors,
  withInterceptorsFromDi,
  withXsrfConfiguration,
} from "@angular/common/http";
import { loaderInterceptor } from "./interceptors/loader.interceptor";

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(appRoutes, withEnabledBlockingInitialNavigation()),
    provideAnimations(),
    provideNoopAnimations(),
    {
      provide: HTTP_INTERCEPTORS,
      useClass: KeycloakBearerInterceptor,
      multi: true,
    },
    provideHttpClient(withInterceptorsFromDi()),
    provideHttpClient(
      withXsrfConfiguration({
        cookieName: "XSRF-TOKEN",
        headerName: "X-XSRF-TOKEN",
      }),
      withInterceptors([loaderInterceptor])
    ),
    LoaderService,
    importProvidersFrom(SharedSpricedSharedLibModule),
  ],
};
