import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ActivatedRoute, RouterModule } from "@angular/router";
import { OneColComponent } from "@spriced-frontend/spriced-ui-lib";
import { MatIconModule } from "@angular/material/icon";
import { ReportService } from "../../services/report.service";

@Component({
  selector: "sp-home",
  standalone: true,
  imports: [CommonModule, OneColComponent, MatIconModule, RouterModule],
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.scss"],
})
export class HomeComponent implements OnInit {
  reports: {
    name: string;
    id: string;
  }[] = [];

  constructor(private route: ActivatedRoute,private reportService:ReportService) {}

  ngOnInit(): void {
    this.route.params.subscribe((parameter: any) => {
      this.getReportsById(parameter.groupId);
    });
  }

  private getReportsById(id: string) {
    this.reportService.getReports().subscribe((result)=>{
      this.reports=result
    })
    // this.reports = [
    //   {
    //     name: "EBU CTT Part Price Comparison",
    //     id: "e56a008b-896f-4b51-8cfe-b9fe38ffdcf2",
    //   },
    //   {
    //     name: "Base File Price List",
    //     id: "13c08fc3-130c-4032-a648-d78f82e9ca04",
    //   },
    //   {
    //     name: "Brazil Parts Price List from Price Lists",
    //     id: "16627743-0290-422a-85c9-fba2ec6bbeeb",
    //   },
    //   {
    //     name: "Segment Entity Audit Report",
    //     id: "d6bb3a14-43d5-490d-806d-b664cdfaa35e",
    //   },
    //   {
    //     name: "OEM Pricing App Missing Base Prices",
    //     id: "300f3c04-af5e-49c1-85d5-2fc01d44bd50",
    //   },
    //   {
    //     name: "Entity Audit Report",
    //     id: "37de99dd-7954-4240-a247-1addaf62015b",
    //   },
    //   {
    //     name: "DN Pricing Percent Change",
    //     id: "0c71fb8b-1532-40d9-ba41-b0f7bf198ffc",
    //   },
    //   {
    //     name: "Pricing Action DN Pricing Summary",
    //     id: "3cc3cd99-4866-422d-9991-59a1bc1aacee",
    //   },
    //   {
    //     name: "DN Pricing Entity Audit Report",
    //     id: "7f3404c4-620c-4e8d-91e4-6425f41ab1e3",
    //   },
    //   {
    //     name: "Brazil OEM PL From Price List",
    //     id: "a10c808d-3f40-45ef-b400-9e49cf605946",
    //   },
    //   {
    //     name: "MDS Arbitrage Report",
    //     id: "268047c0-3e26-498a-9eeb-f109ae83fcc1",
    //   },
    //   {
    //     name: "Brazil Parts Price List from Calculations",
    //     id: "bf101d6c-5547-496a-9830-38196cc37e87",
    //   },
    //   {
    //     name: "GOMS Kit Configuration Suggestions",
    //     id: "d2b10da3-517d-4234-8cfa-8d6bcf6f1330",
    //   },
    //   {
    //     name: "Base Price Outbound",
    //     id: "130ad012-7a70-4976-b5d5-189f62328024",
    //   },
    //   {
    //     name: "PVC Outbound",
    //     id: "2068e27f-bdea-40ed-ad01-e84d69d813dd",
    //   },
    //   {
    //     name: "Pricing Action History",
    //     id: "28c886dd-f695-456c-87a4-8976224562f1",
    //   },
    //   {
    //     name: "IMS (CPIF) Kit Components Where Used",
    //     id: "99a40dfc-f7b3-446e-840c-241e421a8a3f",
    //   },
    //   {
    //     name: "Suggestion Report",
    //     id: "46f0d17d-d4fb-4d81-9e1c-c248f9c895aa",
    //   },
    //   {
    //     name: "New RX NX Core Details",
    //     id: "391db3b6-7250-476a-a3e9-dded0a14dbec",
    //   },
    //   {
    //     name: "Suggested Transit Unique Parts",
    //     id: "73682193-2d83-4baf-8f62-9fe9c9fdb481",
    //   },
    //   {
    //     name: "PC1.2_APM837_Job Failure List",
    //     id: "0f55ca12-e5a4-4e4e-9567-45700b572341",
    //   },
    //   {
    //     name: "CC3.3_APM837_System Data Change Listing",
    //     id: "e7db046e-154c-41d3-9a05-cc12a40dc99c",
    //   },
    //   {
    //     name: "MDS USER LIST",
    //     id: "21b45a63-2b5f-4d75-92d9-180d4f7a6f22",
    //   },
    //   {
    //     name: "CC33_323",
    //     id: "abc9bb46-26ba-487f-87a4-7907612df9d1",
    //   },
    //   {
    //     name: "MDS Transaction Log",
    //     id: "2453b852-5128-4e13-8085-726f26e20af5",
    //   },
    //   {
    //     name: "IMS (CPIF) Kit Components Prices and Costs",
    //     id: "b6bd64ec-2d06-4034-985c-e9922a17053e",
    //   },
    //   {
    //     name: "Core xRef",
    //     id: "e2b2f162-328a-46b6-9526-1a9d4c49d40b",
    //   },
    //   {
    //     name: "Resulting Cost History",
    //     id: "0fa29ccd-25e6-49e1-aab7-3d201d0ba4d6",
    //   },
    //   {
    //     name: "Part Entity Audit Report",
    //     id: "3f03816c-f38d-43ca-9f13-7774613e84e2",
    //   },
    //   {
    //     name: "Price List Outbound",
    //     id: "e61dae3b-1650-48f7-88e0-bc96a5672c0e",
    //   },
    // ];
  }
}
