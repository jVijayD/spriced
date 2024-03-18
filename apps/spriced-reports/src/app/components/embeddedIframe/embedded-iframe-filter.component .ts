import { Component, Input, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { embedDashboard } from "@superset-ui/embedded-sdk";
import { lastValueFrom } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { OneColComponent } from "@spriced-frontend/spriced-ui-lib";
import { MatIconModule } from "@angular/material/icon";

@Component({
  selector: "sp-embedded-iframe-filter",
  standalone: true,
  imports: [CommonModule, OneColComponent, MatIconModule],
  templateUrl: "./embedded-iframe.component.html",
  styleUrls: ["./embedded-iframe.component.scss"],
})
export class EmbeddedIframeFilterComponent implements OnInit {
  _dashboardId: string = "abc";
  @Input() quotedPriceId: any;
  @Input()
  set dashboardId(value: string) {
    this._dashboardId = value;
    this.embed();
  }

  error: boolean = false;
  constructor(private httpClient: HttpClient) {}

  ngOnInit(): void {
    console.log(this.quotedPriceId);
  }

  private embed() {
    this.error = false;
    embedDashboard({
      id: this._dashboardId, // given by the Superset embedding UI
      supersetDomain: process.env["NX_SUPERSET_DOMAIN"] as string,
      mountPoint: document.getElementById("superset-container") as HTMLElement, // any html element that can contain an iframe
      fetchGuestToken: async () => {
        const data: any = (await this.fetchGuestToken(
          this._dashboardId as string
        )) as Promise<string>;
        return data.token;
      },
      dashboardUiConfig: {
        //dashboard UI config: hideTitle, hideTab, hideChartControls, filters.visible, filters.expanded (optional)
        hideTitle: true,
        hideTab: true,
        filters: {
          expanded: false,
          visible: false,
        },
        urlParams: { quoted_price_id: this.quotedPriceId },
      },
    })
      .catch((error) => {
        debugger;
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
