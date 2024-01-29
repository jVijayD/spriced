import { CommonModule } from "@angular/common";
import { HttpClient } from "@angular/common/http";
import { Component, Input } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatMenuModule } from "@angular/material/menu";
import { RouterModule } from "@angular/router";
import { TopMenuComponent } from "@spriced-frontend/spriced-ui-lib";
// import { menuItem } from '@spriced-frontend/shared/data-store';
// import { NgxIndexedDBService } from 'ngx-indexed-db';
import { KeycloakService } from "keycloak-angular";

@Component({
  selector: "sp-header",
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.css"],
  standalone: true,
  imports: [
    CommonModule,
    TopMenuComponent,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    RouterModule,
  ],
})
export class HeaderComponent {
  @Input() username = "username@gmail.com";
  @Input() appname = "username@gmail.com";
  @Input() menuData: any;
  user:any;
  constructor(
    private keycloakService: KeycloakService, //  private dbService: NgxIndexedDBService,
    private httpClient: HttpClient
  ) {
    this.user = this.keycloakService.getKeycloakInstance();
  }

  public logOut(e: any) {
    {
      e.preventDefault();
      e.stopPropagation();
      this.keycloakService.logout(window.location.origin);
      localStorage.clear();
    }
  }

  capitalizeFirstLetter(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  goToLink() {
    const url_help_access = process.env["NX_API_USER-ACCESS_URL"] as string;
    this.httpClient
      .post(`${url_help_access}/help-access`,{ token: "" },{observe: 'response' as 'response',
      withCredentials:true
    })
      .subscribe((data) => {
        if (data) {
          window.open(process.env["NX_HELP"] as string, "_blank");
        }
      });
    //window.open(process.env["NX_HELP"] as string, "_blank");
  }
}
