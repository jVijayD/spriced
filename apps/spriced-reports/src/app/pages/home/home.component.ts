import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ActivatedRoute, RouterModule } from "@angular/router";
import { OneColComponent } from "@spriced-frontend/spriced-ui-lib";
import { MatIconModule } from "@angular/material/icon";

@Component({
  selector: "sp-home",
  standalone: true,
  imports: [CommonModule, OneColComponent, MatIconModule,RouterModule],
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
        name: "Sales",
        id: "631dcfd9-9f0b-4fdb-ad5b-8a2b6c71fbe5",
      },
      {
        name: "Covid",
        id: "4dad7019-aa49-4784-ac60-73aea5f2a9dc",
      },
      {
        name: "Slack",
        id: "ebe77ed2-3309-4fd4-b59b-6c08070faa02",
      },
    ];
  }
}
