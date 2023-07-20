import { Route } from '@angular/router';
import { loadRemoteModule } from '@nx/angular/mf';
import { HomeComponent } from './pages/home/home.component';
import { PageNotFoundComponent } from './pages/page-not-found/page-not-found/page-not-found.component';

export const appRoutes: Route[] = [
  {
    path: 'spriced-user-management',
    loadChildren: () =>
      loadRemoteModule('spriced-user-management', './Routes').then(
        (m) => m.remoteRoutes
      ),
  },
  {
    path: 'spriced-reports',
    loadChildren: () =>
      loadRemoteModule('spriced-reports', './Routes').then(
        (m) => m.remoteRoutes
      ),
  },
  {
    path: 'spriced-data',
    loadChildren: () =>
      loadRemoteModule('spriced-data', './Routes').then((m) => m.remoteRoutes),
  },
  {
    path: 'spriced-data-definition',
    loadChildren: () =>
      loadRemoteModule('spriced-data-definition', './Routes').then(
        (m) => m.remoteRoutes
      ),
  },
  {
    path: '',
    component: HomeComponent,
  },
  {
    path: '**',
    component: PageNotFoundComponent,
  },
];
