import {  APP_INITIALIZER, Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { LoaderComponent } from '@spriced-frontend/spriced-ui-lib';
import {  KeycloakAngularModule } from 'keycloak-angular';
// import { HTTP_INTERCEPTORS } from '@angular/common/http';
// import { KeycloakService } from 'keycloak-angular';
// import { initializeKeycloak } from './core/init/keycloak-init.factory';
// import { KeycloakBearerInterceptor } from './core/interceptors/keycloakInterceptor';

@Component({
  standalone: true,
  imports: [RouterModule, LoaderComponent,KeycloakAngularModule],
  selector: 'sp-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  // providers: [  {
  //     provide: HTTP_INTERCEPTORS,
  //     useClass: KeycloakBearerInterceptor,
  //     multi: true,
  //   },
  //   {
  //     provide: APP_INITIALIZER,
  //     useFactory: initializeKeycloak,
  //     multi: true,
  //     deps: [KeycloakService],
  //   },]
})
export class AppComponent {
  title = 'Spriced';
}
