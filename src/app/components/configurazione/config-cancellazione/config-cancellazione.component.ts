import { Component, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";

export interface DeleteDialogData {
  title: string;
  message: string;
}

@Component({
  selector: "app-config-cancellazione",
  templateUrl: "./config-cancellazione.component.html",
  styleUrls: ["./config-cancellazione.component.scss"],
})
export class ConfigCancellazioneComponent {
  constructor(
    private dialogRef: MatDialogRef<ConfigCancellazioneComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DeleteDialogData,
  ) {}

  close(): void {
    this.dialogRef.close(false);
  }

  confirm(): void {
    this.dialogRef.close(true);
  }
}
