import { Component, Inject } from "@angular/core";
import { MAT_SNACK_BAR_DATA, MatSnackBarRef } from "@angular/material/snack-bar";
import { ToastSnackbarData } from "./toast-snackbar.model";

@Component({
  selector: "app-toast-snackbar",
  templateUrl: "./toast-snackbar.component.html",
  styleUrls: ["./toast-snackbar.component.scss"],
})
export class ToastSnackbarComponent {
  constructor(
    @Inject(MAT_SNACK_BAR_DATA) public data: ToastSnackbarData,
    private snackBarRef: MatSnackBarRef<ToastSnackbarComponent>,
  ) {}

  get icon(): string {
    switch (this.data.type) {
      case "success":
        return "check_circle";
      case "error":
        return "error";
      case "warning":
        return "warning";
      default:
        return "info";
    }
  }

  close(): void {
    this.snackBarRef.dismiss();
  }
}
