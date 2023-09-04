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
      headers: req.headers
        .set("tenant", "meritor")
        .set("user", this.user.profile.email || "")
        .set("transactionId", this.user.profile.id || "")
        .set("roles", this.user.tokenParsed?.realm_access?.roles?.join(","))
        .set("applications", this.user.profile.attributes.application || ""),
    });
    return next.handle(authReq);
  }
}
