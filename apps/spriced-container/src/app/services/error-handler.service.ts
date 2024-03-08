import {
  HttpClient,
  HttpErrorResponse,
  HttpRequest,
} from "@angular/common/http";
import { ErrorHandler, Injectable } from "@angular/core";
import html2canvas from "html2canvas";
import { KeycloakService } from "keycloak-angular";

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
  api_url: string = process.env["NX_API_DATA_URL"] as string;
  errorReport: any = {};
  user: any;
  constructor(
    private httpClient: HttpClient,
    private keycloakService: KeycloakService
  ) {}

  handleError(error: any) {
    this.user = this.keycloakService.getKeycloakInstance();
    if (!(error instanceof HttpErrorResponse)) {
      html2canvas(document.documentElement).then((canvas) => {
        this.errorReport = {
          userName: this.keycloakService.getUsername(),
          userDisplayName:
            this.user.profile?.firstName + " " + this.user.profile?.lastName,
          userRole: this.user.tokenParsed?.realm_access?.roles?.join(","),
          browserScreenShot: canvas.toDataURL("image/png"),
          stackTrace: JSON.stringify(error.stack),
        };
        this.httpClient
          .post(`${this.api_url}/error`, this.errorReport)
          .subscribe((data) => {
            console.log(this.errorReport);
          });
      });
    }
  }
}
