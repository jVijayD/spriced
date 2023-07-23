import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { NxWelcomeComponent } from "./nx-welcome.component";

@Component({
  standalone: true,
  imports: [CommonModule, NxWelcomeComponent],
  selector: "sp-spriced-data-entry",
  template: `<sp-nx-welcome></sp-nx-welcome>`,
})
export class RemoteEntryComponent implements OnInit {
  ngOnInit(): void {
    debugger;
    console.log(
      ">>> NX_API_DEFINITION_URL_DATA",
      process.env["NX_API_DEFINITION_URL"]
    );
  }
}
