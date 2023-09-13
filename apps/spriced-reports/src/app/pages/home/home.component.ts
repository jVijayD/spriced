import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ActivatedRoute } from "@angular/router";
import { EmbeddedIframeComponent } from "../../components/embeddedIframe/embedded-iframe.component";
import { LoaderService } from "@spriced-frontend/spriced-ui-lib";


@Component({
  selector: "sp-home",
  standalone: true,
  imports: [CommonModule, EmbeddedIframeComponent],
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.scss"],
})
export class HomeComponent implements OnInit {

  dashboardId: string = "abc";
  constructor(private route: ActivatedRoute, private loader: LoaderService) {}
  ngOnInit(): void {
    this.dashboardId = this.route.snapshot.paramMap.get(
      "dashboardId"
    ) as string;
    this.route.params.subscribe((parameter: any) => {
      this.dashboardId = parameter.dashboardId;
    });
  }
}
