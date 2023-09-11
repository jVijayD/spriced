import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { embedDashboard } from "@superset-ui/embedded-sdk";
import { ActivatedRoute } from "@angular/router";
import { HttpClient } from "@angular/common/http";
import { lastValueFrom } from "rxjs";
import { OneColComponent } from "@spriced-frontend/spriced-ui-lib";
import { MatIconModule } from "@angular/material/icon";

@Component({
  selector: "sp-home",
  standalone: true,
  imports: [CommonModule, OneColComponent, MatIconModule],
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.scss"],
})
export class HomeComponent implements OnInit {
  error: boolean = false;
  //dashboardId:string="";
  constructor(private route: ActivatedRoute, private httpClient: HttpClient) {}
  ngOnInit(): void {
    this.error = false;
    let dashboardId = this.route.snapshot.paramMap.get("dashboardId");
    if (!dashboardId) {
      dashboardId = "1944859e-82d4-4b8d-995a-8aecb3a2cdaa";
    }

    embedDashboard({
      id: dashboardId, // given by the Superset embedding UI
      supersetDomain: process.env["NX_SUPERSET_DOMAIN"] as string,
      mountPoint: document.getElementById("superset-container") as HTMLElement, // any html element that can contain an iframe
      fetchGuestToken: async () => {
        const data: any = (await this.fetchGuestToken(
          dashboardId as string
        )) as Promise<string>;
        return data.token;
      },
      dashboardUiConfig: {
        // dashboard UI config: hideTitle, hideTab, hideChartControls, filters.visible, filters.expanded (optional)
        hideTitle: true,
        filters: {
          expanded: true,
        },
      },
    })
      .catch((error) => {
        (
          document.getElementById("superset-container") as HTMLElement
        ).style.display = "none";
        this.error = true;
      })
      .finally(() => {
        this.setIframeSize();
      });
  }

  private fetchGuestToken(dashboardId: string) {
    return lastValueFrom(
      this.httpClient.post(
        `${process.env["NX_API_USER-ACCESS_URL"]}/reports/token`,
        { dashboardIds: [dashboardId] }
      )
    );
  }

  private setIframeSize() {
    const iframe = (
      document.getElementById("superset-container") as HTMLElement
    ).getElementsByTagName("iframe");
    if (iframe && iframe.length) {
      iframe[0].style.minWidth = "100%";
      iframe[0].style.minHeight = "100%";
    }
  }
}
