import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ActivatedRoute, RouterModule } from "@angular/router";
import { OneColComponent } from "@spriced-frontend/spriced-ui-lib";
import { MatIconModule } from "@angular/material/icon";

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

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.params.subscribe((parameter: any) => {
      this.getReportsById(parameter.groupId);
    });
  }

  private getReportsById(id: string) {
    this.reports = [
      {
        name: "EBU CTT Part Price Comparison",
        id: "c6ca61c6-f32d-4aac-98ed-2c715b626718",
      },
      {
        name: "Base File Price List",
        id: "13c08fc3-130c-4032-a648-d78f82e9ca04",
      },
      {
        name: "Brazil Parts Price List from Price Lists",
        id: "10839d07-9093-4551-b051-48c4dbd133f7",
      },
      {
        name: "Segment Entity Audit Report",
        id: "d8f840b8-691c-4092-b0c9-466ce1c0fefc",
      },
      {
        name: "OEM Pricing App Missing Base Prices",
        id: "2c2c91bf-72fb-4c28-a11a-4ae454c4c41a",
      },
      {
        name: "Entity Audit Report",
        id: "37de99dd-7954-4240-a247-1addaf62015b",
      },
      {
        name: "DN Pricing Percent Change",
        id: "593af37a-03f0-47c5-9cd0-09ae0baaff08",
      },
      {
        name: "Pricing Action DN Pricing Summary",
        id: "ab0ae856-5de1-4cd5-8635-cf35fa0ae7c6",
      },
      {
        name: "DN Pricing Entity Audit Report",
        id: "dad070de-48e8-4304-9a11-312c307b017a",
      },
      {
        name: "Brazil OEM PL From Price List",
        id: "a10c808d-3f40-45ef-b400-9e49cf605946",
      },
      {
        name: "MDS Arbitrage Report",
        id: "3138e511-99fe-465d-956a-c628a39c8a56",
      },
      {
        name: "Brazil Parts Price List from Calculations",
        id: "bf101d6c-5547-496a-9830-38196cc37e87",
      },
      {
        name: "GOMS Kit Configuration Suggestions",
        id: "c597ae7d-d944-4a91-aa14-f65b76da7311",
      },
      {
        name: "Base Price Outbound",
        id: "406cdda9-85ec-44a3-b663-3608b201e27c",
      },
      {
        name: "PVC Outbound",
        id: "46d13e77-062d-4cd6-a00c-304ddf6b0c93",
      },
      {
        name: "Pricing Action History",
        id: "28c886dd-f695-456c-87a4-8976224562f1",
      },
      {
        name: "IMS (CPIF) Kit Components Where Used",
        id: "99a40dfc-f7b3-446e-840c-241e421a8a3f",
      },
      {
        name: "Suggestion Report",
        id: "def9a6a4-17e3-4237-a7bd-b2fd431c2ccb",
      },
      {
        name: "New RX NX Core Details",
        id: "97206f23-b48b-479a-a96b-3b28e752eb8d",
      },
      {
        name: "Suggested Transit Unique Parts",
        id: "259aa56b-a2af-4e91-89f9-e027dd1e0dec",
      },
      {
        name: "PC1.2_APM837_Job Failure List",
        id: "0f55ca12-e5a4-4e4e-9567-45700b572341",
      },
      {
        name: "CC3.3_APM837_System Data Change Listing",
        id: "e7db046e-154c-41d3-9a05-cc12a40dc99c",
      },
      {
        name: "MDS USER LIST",
        id: "21b45a63-2b5f-4d75-92d9-180d4f7a6f22",
      },
      {
        name: "CC33_323",
        id: "abc9bb46-26ba-487f-87a4-7907612df9d1",
      },
      {
        name: "MDS Transaction Log",
        id: "2453b852-5128-4e13-8085-726f26e20af5",
      },
      {
        name: "IMS (CPIF) Kit Components Prices and Costs",
        id: "b6bd64ec-2d06-4034-985c-e9922a17053e",
      },
      {
        name: "Core xRef",
        id: "6d7da0d4-2a2a-4c15-9edd-f85154bbe3da",
      },
      {
        name: "Resulting Cost History",
        id: "cc05e151-caed-4acb-b2f8-35411804649d",
      },
      {
        name: "Part Entity Audit Report",
        id: "6598b267-b3f2-43db-ab01-9e77c99a72ca",
      },
      {
        name: "Price List Outbound",
        id: "e61dae3b-1650-48f7-88e0-bc96a5672c0e",
      },
      {
        name: "Quote Impact Analysis",
        id: "ad696a7d-4def-4b84-a046-abcec12e4948",
      },
      
    ];
  }
}
