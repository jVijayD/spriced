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
import { AppDataService, Application } from "@spriced-frontend/shared/spriced-shared-lib";
import { KeycloakAuthGuard, KeycloakService } from "keycloak-angular";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class AuthGuard extends KeycloakAuthGuard {
  user: any;
  apps$ :Observable<Application[]>;
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
      const returnUrl = this.aroute.snapshot.queryParams['returnUrl'];
      const defaultReturnUrl = returnUrl || `${window.location.pathname}${window.location.search}`;
      const encodedDefaultReturnUrl = encodeURIComponent(defaultReturnUrl);
      window.location.href = `${window.location.origin}?returnUrl=${encodedDefaultReturnUrl}`;
      return true;
    }
    if (!this.hasRoles() || !this.hasAppPermission(route.url.toString())) {
      console.log(window.location.origin + state.url);
      window.location.href = `${window.location.origin}/unauthorized`;
    }
    return true;
  }

  hasAppPermission(url : string){
    let retObj = false;
    this.apps$.forEach(a=>{
      if(a.map(app=>app.path)
      .filter(p=>url.indexOf(p)!=-1)
      .length > 0){
        retObj = true;
      }
    });
    return retObj;
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
        roles: this.user.tokenParsed?.realm_access?.roles?.filter((r:String)=>!r.startsWith("default-roles")).join(","),
        applications: this.user.profile.attributes.application || "",
      }),
    });
    return next.handle(authReq);
  }
}
