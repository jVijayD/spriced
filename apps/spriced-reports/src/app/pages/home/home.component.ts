import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { embedDashboard } from "@superset-ui/embedded-sdk";
import { ActivatedRoute } from "@angular/router";

@Component({
  selector: "sp-home",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.scss"],
})
export class HomeComponent implements OnInit {
  //dashboardId:string="";
  constructor(private route: ActivatedRoute) {}
  ngOnInit(): void {
    let dashboardId = this.route.snapshot.paramMap.get("dashboardId");
    if (!dashboardId) {
      dashboardId = "f4adaabb-7e11-470a-b9e8-0f65964f80ee";
    }
    // embedDashboard({
    //   id: "abc123", // given by the Superset embedding UI
    //   supersetDomain: "https://superset.example.com",
    //   mountPoint: document.getElementById(
    //     "my-superset-container"
    //   ) as HTMLElement, // any html element that can contain an iframe
    //   fetchGuestToken: () => {
    //     return Promise.resolve("");
    //   },
    //   dashboardUiConfig: {
    //     // dashboard UI config: hideTitle, hideTab, hideChartControls, filters.visible, filters.expanded (optional)
    //     hideTitle: true,
    //     filters: {
    //       expanded: true,
    //     },
    //   },
    // });
  }
}
