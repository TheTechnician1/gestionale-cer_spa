import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-conferma-dialog',
  template: `
    <div style="padding:10px">
      <h2 mat-dialog-title>Conferma Eliminazione</h2>
      <mat-dialog-content>
        Sei sicuro di voler eliminare definitivamente la scheda dati energetici
        dell'anno <strong>{{ data.anno }}</strong
        >?
      </mat-dialog-content>
      <mat-dialog-actions align="end">
        <button mat-button (click)="onAnnulla()">Annulla</button>
        <button mat-raised-button color="warn" (click)="onConferma()">
          Elimina
        </button>
      </mat-dialog-actions>
    </div>
  `,
  styles: [
    `
      mat-dialog-actions {
        padding: 16px 0 0 0;
      }
    `,
  ],
})
export class ConfermaDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<ConfermaDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { anno: string },
  ) {}

  onAnnulla(): void {
    this.dialogRef.close(false);
  }

  onConferma(): void {
    this.dialogRef.close(true);
  }
}
