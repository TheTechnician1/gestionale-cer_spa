import { Component, Inject } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

export interface ConfermaPasswordDialogData {
  titolo: string;
  messaggio: string;
}

@Component({
  selector: 'app-conferma-password-dialog',
  templateUrl: './conferma-password-dialog.component.html',
  styleUrls: ['./conferma-password-dialog.component.scss'],
})
export class ConfermaPasswordDialogComponent {
  password = new FormControl('', [Validators.required]);
  nascondiPassword = true;

  constructor(
    private dialogRef: MatDialogRef<ConfermaPasswordDialogComponent, string | null>,
    @Inject(MAT_DIALOG_DATA) public data: ConfermaPasswordDialogData
  ) {}

  annulla(): void {
    this.dialogRef.close(null);
  }

  conferma(): void {
    if (this.password.invalid) {
      this.password.markAsTouched();
      return;
    }

    this.dialogRef.close(this.password.value);
  }
}
