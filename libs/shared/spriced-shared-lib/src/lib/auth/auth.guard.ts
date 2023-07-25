import { HttpEvent, HttpHandler, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
  Router,
} from '@angular/router';
import { KeycloakAuthGuard, KeycloakService } from 'keycloak-angular';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard extends KeycloakAuthGuard {
  constructor(
    protected override readonly router: Router,
    protected readonly keycloak: KeycloakService
  ) {
    super(router, keycloak);
  }
  async isAccessAllowed(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Promise<boolean | UrlTree> {
    console.log(this.authenticated);
    if (!this.authenticated) {
      console.log(window.location.origin + state.url);
      await this.keycloak.login({
        redirectUri: window.location.origin + state.url,
      });
    }
    return this.authenticated;
  }
  getAccessToken() {
    return this.keycloak.getKeycloakInstance().token;
  }
  async intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Promise<Observable<HttpEvent<any>>> {
    const bearerToken = await this.keycloak.getToken();
    if (!req.headers.has('Authorization')) {
      req = req.clone({
        headers: req.headers.set('Authorization', `Bearer ${bearerToken}`),
      });
    }

    // add other custom headers
    return next.handle(req);
  }
}
