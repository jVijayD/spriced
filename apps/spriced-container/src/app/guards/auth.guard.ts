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
import {
  AppDataService,
  Application,
} from "@spriced-frontend/shared/spriced-shared-lib";
import { KeycloakAuthGuard, KeycloakService } from "keycloak-angular";
import { Observable, first, map, toArray } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class AuthGuard extends KeycloakAuthGuard {
  user: any;
  apps$: Observable<Application[] | null>;
  constructor(
    protected override readonly router: Router,
    protected readonly keycloak: KeycloakService,
    public appDataService: AppDataService,
    private aroute: ActivatedRoute
  ) {
    super(router, keycloak);
    this.apps$ = this.appDataService.getApps();
  }
  async isAccessAllowed(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Promise<boolean | UrlTree> {
    if (!this.authenticated) {
      const returnUrl = this.aroute.snapshot.queryParams["returnUrl"];
      const defaultReturnUrl =
        returnUrl || `${window.location.pathname}${window.location.search}`;
      const encodedDefaultReturnUrl = encodeURIComponent(defaultReturnUrl);
      window.location.href = `${window.location.origin}?returnUrl=${encodedDefaultReturnUrl}`;
      return true;
    }

    return this.hasAppPermission(route);
  }

  async hasAppPermission(route: ActivatedRouteSnapshot) {
    return new Promise<boolean>((resolve, reject) => {
      if (!this.hasRoles()) {
        this.router.navigate([`/unauthorized`]);
        resolve(false);
      } else {
        this.apps$.subscribe({
          next: (appList) => {
            if (appList !== null) {
              const url = route.url[0];
              let retVal =
                appList
                  .map((app) => app.path)
                  .filter((path) => path === url.path)
                  .length > 0;
              if (!retVal) {
                this.router.navigate([`/unauthorized`]);
                resolve(false);
              } else {
                resolve(true);
              }
            }
          },
          error: reject,
        });
      }
    });
  }

  hasRoles() {
    let roles =
      this.keycloak.getKeycloakInstance().tokenParsed?.realm_access?.roles;
    console.log(roles);
    return (
      roles != undefined && !roles.includes("External") && roles.length > 1
    );
  }
  // async intercept(
  //   req: HttpRequest<any>,
  //   next: HttpHandler
  // ): Promise<Observable<HttpEvent<any>>> {
  //   this.user = this.keycloak.getKeycloakInstance();
  //   const authReq = req.clone({
  //     headers: new HttpHeaders({
  //       tenant: "meritor",
  //       user: this.user.profile.email || "",
  //       transactionId: this.user.profile.id || "",
  //       roles: this.user.tokenParsed?.realm_access?.roles
  //         ?.filter((r: String) => !r.startsWith("default-roles"))
  //         .join(","),
  //       applications: this.user.profile.attributes.application || "",
  //     }),
  //   });
  //   return next.handle(authReq);
  // }
}
