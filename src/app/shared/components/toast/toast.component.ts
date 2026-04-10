import { Component, Inject } from "@angular/core";
import { MAT_SNACK_BAR_DATA, MatSnackBarRef } from "@angular/material/snack-bar";

export interface ToastData {
  title?: string;
  message: string;
}

@Component({
  selector: "app-toast",
  templateUrl: "./toast.component.html",
  styleUrls: ["./toast.component.scss"],
})
export class ToastComponent {
  constructor(
    private snackBarRef: MatSnackBarRef<ToastComponent>,
    @Inject(MAT_SNACK_BAR_DATA) public data: ToastData,
  ) {}

  close(): void {
    this.snackBarRef.dismiss();
  }
}
