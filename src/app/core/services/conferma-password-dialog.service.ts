import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { map, Observable } from 'rxjs';
import { ConfermaPasswordDialogComponent } from '../../conferma-password-dialog/conferma-password-dialog.component';

@Injectable({
  providedIn: 'root',
})
export class ConfermaPasswordDialogService {
  constructor(private dialog: MatDialog) {}

  richiediPassword(titolo: string, messaggio: string): Observable<string | null> {
    return this.dialog
      .open(ConfermaPasswordDialogComponent, {
        width: '420px',
        maxWidth: '95vw',
        disableClose: true,
        data: { titolo, messaggio },
      })
      .afterClosed()
      .pipe(map((password) => password || null));
  }
}
