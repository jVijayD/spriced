import { Component, Inject } from "@angular/core";
import {
  MAT_SNACK_BAR_DATA,
  MatSnackBarRef,
} from "@angular/material/snack-bar";

@Component({
  selector: "sp-snackbar-failure",
  templateUrl: "./snackbar-failure.component.html",
  styleUrls: ["./snackbar-failure.component.scss"],
})
export class SnackbarFailureComponent {
  constructor(
    public sbRef: MatSnackBarRef<SnackbarFailureComponent>,
    @Inject(MAT_SNACK_BAR_DATA) public data: any
  ) {}

  render(message: string) {
    message.split("\n").map((msg) => {
      return `<span>${msg}</span>`;
    });
    return message;
  }

  onClose() {
    this.sbRef.dismiss();
  }
}
