import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MatIconModule } from "@angular/material/icon";
import {
  ErrorTypes,
  StatusPannelService,
  errorElement,
} from "@spriced-frontend/shared/spriced-shared-lib";
import { MatDialog, MatDialogModule } from "@angular/material/dialog";
import { StatusDialogueComponent } from "./status-dialogue/status-dialogue.component";

@Component({
  selector: "sp-status-panel",
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatDialogModule,
    StatusDialogueComponent,
  ],
  templateUrl: "./status-panel.component.html",
  styleUrls: ["./status-panel.component.scss"],
})
export class StatusPanelComponent implements OnInit{
  constructor(
    public dialog: MatDialog,
    private statusPnlService: StatusPannelService
  ) {}
  ngOnInit(): void {
    this.statusPnlService.$ERROR_LIST.subscribe((r) => {
      this.ERROR_LIST = r;
    });
  }
  ERROR_LIST: errorElement[] = [];

  onErrorClick() {
    this.dialog.open(StatusDialogueComponent, {
      data: this.ERROR_LIST,
    });
  }
  onInfoClick() {
    this.dialog.open(StatusDialogueComponent, {
      data: this.ERROR_LIST,
    });
  }

  getWarningCount() {
    return this.ERROR_LIST.filter((e) => e.type == ErrorTypes.WARNING).length;
  }

  getErrorCount() {
    return this.ERROR_LIST.filter((e) => e.type == ErrorTypes.ERROR).length;
  }

  hasErrors() {
    return this.ERROR_LIST.length > 0;
  }
}
