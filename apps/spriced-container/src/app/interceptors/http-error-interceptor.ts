import { Injectable } from "@angular/core";
import {
  HttpClient,
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { catchError, map } from "rxjs/operators";
import {
  AppDataService,
  ErrorTypes,
} from "@spriced-frontend/shared/spriced-shared-lib";
import html2canvas from "html2canvas";
import { KeycloakService } from "keycloak-angular";

@Injectable()
export class ErrorCatchingInterceptor implements HttpInterceptor {
  user:any
  api_url = process.env["NX_API_DATA_URL"] as string;
  constructor(private statusPannelService: AppDataService,private httpClient: HttpClient,private keycloakService:KeycloakService) {}
  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    
    return next.handle(request).pipe(
      map((res) => {
        return res;
      }),
      catchError((error: HttpErrorResponse) => {
        if(error.error.requestURI !== '/api/v1/data-api/error')
        {this.handleError(request,error)}
        let errorMsg = "";
        if (error.error instanceof ErrorEvent) {
          errorMsg = `Error: ${error.error.message}`;
        } else {
          errorMsg = `Error Code: ${error.status},  Message: ${
            error?.error?.message ? error.error.message : error.message
          }`;
        }
        if (errorMsg) {
          this.statusPannelService.setErrors([
            {
              type: ErrorTypes.ERROR,
              msg: errorMsg,
            },
          ]);
        }
        return throwError(() => error);
      })
    );
  }
  handleError(request:HttpRequest<unknown>,error:HttpErrorResponse)
  {
    this.user = this.keycloakService.getKeycloakInstance();
    html2canvas(document.documentElement).then((canvas) => {
      let errorReport = {
        userName: this.keycloakService.getUsername(),
        userDisplayName:this.user.profile?.firstName + " " + this.user.profile?.lastName,
        userRole: this.user.tokenParsed?.realm_access?.roles?.join(","),
        browserScreenShot: canvas.toDataURL("image/png"),
        stackTrace: JSON.stringify(error),
        apiInput:request.body,
        apiEndPoint:error.url,
        apiOutput:error.error
      };
      this.httpClient
        .post(`${this.api_url}/error`, errorReport)
        .subscribe((data) => {
        });
    });
  }
  }

