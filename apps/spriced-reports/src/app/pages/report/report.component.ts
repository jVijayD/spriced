import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { EmbeddedIframeComponent } from "../../components/embeddedIframe/embedded-iframe.component";
import { ActivatedRoute, ParamMap } from "@angular/router";

@Component({
  selector: "sp-report",
  standalone: true,
  imports: [CommonModule, EmbeddedIframeComponent],
  templateUrl: "./report.component.html",
  styleUrls: ["./report.component.scss"],
})
export class ReportComponent implements OnInit {
  dashboardId: string = "abc";
  quotedPriceId: any;

  constructor(private route: ActivatedRoute) {}
  ngOnInit(): void {
    this.dashboardId = this.route.snapshot.paramMap.get(
      "dashboardId"
    ) as string;
    this.route.queryParams
    .subscribe(params => {
      this.quotedPriceId=params
    })
    this.route.params.subscribe((parameter: any) => {
      console.log(parameter)
      this.dashboardId = parameter.dashboardId;
    });
  }
}
