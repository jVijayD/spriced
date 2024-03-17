import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ActivatedRoute } from "@angular/router";
import { EmbeddedIframeFilterComponent } from "../../components/embeddedIframe/embedded-iframe-filter.component ";

@Component({
  selector: "sp-report",
  standalone: true,
  imports: [CommonModule, EmbeddedIframeFilterComponent],
  templateUrl: "./report-filter.component.html",
  styleUrls: ["./report-filter.component.scss"],
})
export class ReportFilterComponent implements OnInit {
  dashboardId: string = "abc";
  quotedPriceId: string = "abc";

  constructor(private route: ActivatedRoute) {}
  ngOnInit(): void {
    this.dashboardId = this.route.snapshot.paramMap.get(
      "dashboardId"
    ) as string;
    this.quotedPriceId = this.route.snapshot.paramMap.get(
      "quotedPriceId"
    ) as string;
    this.route.params.subscribe((parameter: any) => {
      this.dashboardId = parameter.dashboardId;
      this.quotedPriceId=parameter.quotedPriceId;
    });
  }
}
