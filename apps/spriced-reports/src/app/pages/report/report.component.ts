import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { EmbeddedIframeComponent } from "../../components/embeddedIframe/embedded-iframe.component";
import { ActivatedRoute } from "@angular/router";

@Component({
  selector: "sp-report",
  standalone: true,
  imports: [CommonModule, EmbeddedIframeComponent],
  templateUrl: "./report.component.html",
  styleUrls: ["./report.component.scss"],
})
export class ReportComponent implements OnInit {
  dashboardId: string = "abc";
  constructor(private route: ActivatedRoute) {}
  ngOnInit(): void {
    this.dashboardId = this.route.snapshot.paramMap.get(
      "dashboardId"
    ) as string;
    this.route.params.subscribe((parameter: any) => {
      this.dashboardId = parameter.dashboardId;
    });
  }
}
