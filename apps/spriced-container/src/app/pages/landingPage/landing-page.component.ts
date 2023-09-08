import { CommonModule } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { MatIconModule } from "@angular/material/icon";
import { ActivatedRoute, Router, RouterModule } from "@angular/router";
import { MatMenuModule } from "@angular/material/menu";
import { AppCardComponent } from "@spriced-frontend/spriced-ui-lib";
import { KeycloakService } from "keycloak-angular";
import { AppDataService, Application } from "@spriced-frontend/shared/spriced-shared-lib";
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
  providers:[AppDataService]
})
export class LandingPageComponent implements OnInit {
  
  labels: any;
  apps:Application[]=[];
  user = "";
  constructor(
    private keycloakService: KeycloakService,
    private aroute: ActivatedRoute,
    private router: Router,
    public appDataService: AppDataService
    ) {}

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
    if(!!this.user)
    {
      if(!!this.user && this.aroute.snapshot.queryParams['returnUrl'])
      {
        const returnUrl = this.aroute.snapshot.queryParams['returnUrl'];
        this.router.navigateByUrl(returnUrl);
      }
    }
    this.appDataService.getApps().subscribe(e=>this.apps=e);
  }
  capitalizeFirstLetter(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
}
