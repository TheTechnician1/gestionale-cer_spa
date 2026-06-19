import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-ricevuta-dialog',
  templateUrl: './ricevuta-dialog.component.html',
  styleUrls: ['./ricevuta-dialog.component.scss'],
})
export class RicevutaDialogComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: RicevutaDialogData,
    private dialogRef: MatDialogRef<RicevutaDialogComponent>,
  ) {}

  continua(): void {
    this.dialogRef.close(true);
  }
}

export interface RicevutaDialogData {
  tipo: 'pdf' | 'email';
}
