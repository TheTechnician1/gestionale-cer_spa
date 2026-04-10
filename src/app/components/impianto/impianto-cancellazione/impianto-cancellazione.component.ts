import { Component, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";

export interface DeleteDialogData {
  title: string;
  message: string;
}

@Component({
  selector: "app-impianto-cancellazione",
  templateUrl: "./impianto-cancellazione.component.html",
  styleUrls: ["./impianto-cancellazione.component.scss"],
})
export class ImpiantoCancellazioneComponent {
  constructor(
    private dialogRef: MatDialogRef<ImpiantoCancellazioneComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DeleteDialogData,
  ) {}

  close(): void {
    this.dialogRef.close(false);
  }

  confirm(): void {
    this.dialogRef.close(true);
  }
}
