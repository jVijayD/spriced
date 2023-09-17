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
        id: "e56a008b-896f-4b51-8cfe-b9fe38ffdcf2",
      },
      {
        name: "Base File Price List",
        id: "13c08fc3-130c-4032-a648-d78f82e9ca04",
      },
      {
        name: "Brazil Parts Price List from Price Lists",
        id: "16627743-0290-422a-85c9-fba2ec6bbeeb",
      },
      {
        name: "Segment Entity Audit Report",
        id: "d6bb3a14-43d5-490d-806d-b664cdfaa35e",
      },
      {
        name: "OEM Pricing App Missing Base Prices",
        id: "300f3c04-af5e-49c1-85d5-2fc01d44bd50",
      },
      {
        name: "Entity Audit Report",
        id: "37de99dd-7954-4240-a247-1addaf62015b",
      },
      {
        name: "DN Pricing Percent Change",
        id: "0c71fb8b-1532-40d9-ba41-b0f7bf198ffc",
      },
      {
        name: "Pricing Action DN Pricing Summary",
        id: "3cc3cd99-4866-422d-9991-59a1bc1aacee",
      },
      {
        name: "Brazil OEM PL From Price List",
        id: "a10c808d-3f40-45ef-b400-9e49cf605946",
      },
    ];
  }
}
