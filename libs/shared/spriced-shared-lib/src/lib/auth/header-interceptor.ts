import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpHeaders,
} from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { KeycloakService } from "keycloak-angular";

@Injectable()
export class headerInterceptor implements HttpInterceptor {
  constructor(private keycloak: KeycloakService) {}
  user: any;

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    this.user = this.keycloak.getKeycloakInstance();
    const authReq = req.clone({
      headers: new HttpHeaders({
        tenant: "meritor",
        user: this.user.profile.email || '',
        transactionId: this.user.profile.id || '',
        roles: this.user.tokenParsed?.realm_access?.roles?.join(","),
        applications: this.user.profile.attributes.application || '',
      }),
    });
    return next.handle(authReq);
  }
}
