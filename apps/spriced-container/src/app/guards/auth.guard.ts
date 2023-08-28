import {
  HttpEvent,
  HttpHandler,
  HttpHeaders,
  HttpRequest,
} from "@angular/common/http";
import { Injectable } from "@angular/core";
import {
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
  Router,
  ActivatedRoute,
} from "@angular/router";
import { KeycloakAuthGuard, KeycloakService } from "keycloak-angular";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class AuthGuard extends KeycloakAuthGuard {
  user: any;
  constructor(
    protected override readonly router: Router,
    protected readonly keycloak: KeycloakService,
    private aroute: ActivatedRoute
  ) {
    super(router, keycloak);
  }
  async isAccessAllowed(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Promise<boolean | UrlTree> {
    if (!this.authenticated) {
      const returnUrl = this.aroute.snapshot.queryParams['returnUrl'];
      const defaultReturnUrl = returnUrl || `${window.location.pathname}${window.location.search}`;
      const encodedDefaultReturnUrl = encodeURIComponent(defaultReturnUrl);
      window.location.href = `${window.location.origin}?returnUrl=${encodedDefaultReturnUrl}`;
      return true;
    }
    if (!this.hasRoles()) {
      console.log(window.location.origin + state.url);
      window.location.href = `${window.location.origin}/unauthorized`;
    }
    return true;
  }

  hasRoles() {
    let roles =
      this.keycloak.getKeycloakInstance().tokenParsed?.realm_access?.roles;
    console.log(roles);
    return roles != undefined && !roles.includes("External") && roles.length > 1 ;
  }
  async intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Promise<Observable<HttpEvent<any>>> {
    this.user = this.keycloak.getKeycloakInstance();
    const authReq = req.clone({
      headers: new HttpHeaders({
        tenant: "meritor",
        user: this.user.profile.email || "",
        transactionId: this.user.profile.id || "",
        roles: this.user.tokenParsed?.realm_access?.roles?.join(","),
        applications: this.user.profile.attributes.application || "",
      }),
    });
    return next.handle(authReq);
  }
}
