import { Component, OnInit } from "@angular/core";
import { FormGroup, FormControl } from '@angular/forms';
import { ImpiantoService } from '../../services/impianto.service';
import { catchError, tap } from 'rxjs/operators';
import { of } from 'rxjs';
import { Impianto } from "src/app/core/interfaces/impianto.model";
import { StatoImpianto } from "src/app/core/enum/stato-impianto.enum";
import { ConfermaDialogComponent } from "../../dati-energetici/dialog/dialog.component";
import { MatDialog } from "@angular/material/dialog";
import { MatPaginator,PageEvent } from '@angular/material/paginator';

@Component({
  selector: "app-impianti-ricerca",
  templateUrl: "./impianti-ricerca.component.html",
  styleUrls: ["./impianti-ricerca.component.scss"],
})
export class ImpiantiRicercaComponent implements OnInit {

  statiImpianto = Object.values(StatoImpianto);
  cerList: any[] = [];
  risultati: Impianto[] = [];
  risultatiPaginati: Impianto[] = [];

  pageIndex = 0;
  pageSize = 5;
  totalElements = 0;

  mostraForm: boolean = false;
  impiantoSelezionato: Impianto | null = null;
  impiantoDettaglio: Impianto | null = null; 

  form: FormGroup = new FormGroup({
    idCer: new FormControl(null),
    codiceCabina: new FormControl(null),
    tipologia: new FormControl(null),
    statoImpianto: new FormControl(null),
    regione: new FormControl(null),
    provincia: new FormControl(null),
    comune: new FormControl(null),
    potenzaNominaleMin: new FormControl(null),
    potenzaNominaleMax: new FormControl(null),
    flgAccumulo: new FormControl(null),
    inclusiDisattivati: new FormControl(false)
  });

  onPageChange(event: PageEvent): void {
  this.pageIndex = event.pageIndex;
  this.pageSize = event.pageSize;

    this.aggiornaPaginazione();
}

aggiornaPaginazione(): void {
  const startIndex = this.pageIndex * this.pageSize;
  const endIndex = startIndex + this.pageSize;
  this.risultatiPaginati =
    this.risultati.slice(startIndex, endIndex);
}

  constructor(private impiantoService: ImpiantoService,private dialog: MatDialog) {}

  ngOnInit(): void {
    this.cerca();
  }

  cerca(): void {
  const payload = this.form.getRawValue();
  this.impiantoService.getImpianti(payload)
    .pipe(tap(risposta => {
        this.risultati = risposta;
        this.totalElements = risposta.length;
        this.aggiornaPaginazione();
      }),
      catchError(errore => {console.error('Errore backend', errore);
        this.risultati = [];
        this.risultatiPaginati = [];
        this.totalElements = 0;
        return of([]);
      })

    )
    .subscribe();
}

  reset(): void {
    this.form.reset({ inclusiDisattivati: false });
    this.cerca();
  }

  nuovoImpianto(): void {
    this.impiantoSelezionato = null;
    this.impiantoDettaglio = null; 
    this.mostraForm = true;
  }

  modificaImpianto(impianto: Impianto): void {
    this.impiantoSelezionato = impianto;
    this.impiantoDettaglio = null; 
    this.mostraForm = true;
  }

  chiudiForm(): void {
    this.mostraForm = false;
    this.impiantoSelezionato = null;
    this.cerca();
  }

  apriDettaglio(impianto: Impianto): void { 
    this.impiantoDettaglio = this.impiantoDettaglio?.idImpianto === impianto.idImpianto ? null : impianto;
  }

  eliminaImpianto(impianto: Impianto): void {
  if (!impianto.idImpianto) return;

  const dialogRef = this.dialog.open(ConfermaDialogComponent, {
    width: '400px',
    data: { codiceCabina: impianto.codiceCabina },
  });

  dialogRef.afterClosed().subscribe((confermato: boolean) => {
    if (confermato) {
      this.impiantoService
        .deleteImpianto(impianto)
        .subscribe(() => {
          this.cerca();

          if (
            this.mostraForm &&
            this.impiantoSelezionato?.idImpianto === impianto.idImpianto
          ) {
            this.mostraForm = false;
            this.impiantoSelezionato = null;
          }

          if (this.impiantoDettaglio?.idImpianto === impianto.idImpianto) {
            this.impiantoDettaglio = null;
          }
        });
    }
  });
}

}