import { CommonModule } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { MatIconModule } from "@angular/material/icon";
import { RouterModule } from "@angular/router";
import { MatMenuModule } from "@angular/material/menu";
import { AppCardComponent } from "@spriced-frontend/spriced-ui-lib";
import { KeycloakService } from "keycloak-angular";

@Component({
  selector: "sp-landing-page",
  standalone: true,
  templateUrl: "./landing-page.component.html",
  styleUrls: ["./landing-page.component.scss"],
  imports: [
    CommonModule,
    MatIconModule,
    RouterModule,
    MatMenuModule,
    AppCardComponent,
  ],
})
export class LandingPageComponent implements OnInit {
  labels: any;
  user = "";
  constructor(private keycloakService: KeycloakService) {}

  ngOnInit(): void {
    this.initializeUserOptions();
  }
  public logOut(e: any) {
    {
      e.preventDefault();
      e.stopPropagation();
      this.keycloakService.logout();
      localStorage.clear();
    }
  }
  private initializeUserOptions(): void {
    this.user = this.keycloakService.getUsername();
    console.log(this.keycloakService.getKeycloakInstance());
  }
  capitalizeFirstLetter(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
}
