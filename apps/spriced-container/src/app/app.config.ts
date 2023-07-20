import { ApplicationConfig } from '@angular/core';
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

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(appRoutes, withEnabledBlockingInitialNavigation()),
    provideAnimations(),
    provideNoopAnimations(),
    LoaderService,
  ],
};
