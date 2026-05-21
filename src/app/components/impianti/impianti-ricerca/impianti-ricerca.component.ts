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
import { Router,ActivatedRoute,NavigationEnd } from "@angular/router";
import { filter } from 'rxjs/operators';
import { UtenteService } from "src/app/core/services/utente.service";
import { Ruolo } from "src/app/core/enum/role.enum";

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

  figlioAttivo: boolean = false;
  isAdmin: boolean = false;

constructor(
  private impiantoService: ImpiantoService,
  private dialog: MatDialog,
  private router: Router,
  private route: ActivatedRoute,
  public utenteService: UtenteService
) {
}

  ngOnInit(): void {
  this.isAdmin = this.utenteService.getRole()?.toUpperCase() === 'ADMIN';
  
  this.router.events.pipe(
    filter(event => event instanceof NavigationEnd)
  ).subscribe(() => {
    this.figlioAttivo = this.route.children.length > 0;
    if (!this.figlioAttivo) {
      this.cerca();
    }
    
  });

  this.cerca();
}

  cerca(): void {
    const payload = this.form.getRawValue();
    this.impiantoService.getImpianti(payload)
      .pipe(
        tap(risposta => {
          this.risultati = risposta;
          this.totalElements = risposta.length;
          this.aggiornaPaginazione();
        }),
        catchError(errore => {
          console.error('Errore backend', errore);
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

  

  onPageChange(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.aggiornaPaginazione();
  }

  aggiornaPaginazione(): void {
    const startIndex = this.pageIndex * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.risultatiPaginati = this.risultati.slice(startIndex, endIndex);
  }

  nuovoImpianto(): void {
    this.router.navigate(['inserimento-impianto'], { relativeTo: this.route });
  }

  modificaImpianto(impianto: Impianto): void {
    this.router.navigate(['modifica-impianto', impianto.idImpianto], { relativeTo: this.route });
  }

  apriDettaglio(impianto: Impianto): void {
    this.router.navigate(['dettaglio-impianto', impianto.idImpianto], { relativeTo: this.route });
  }

  eliminaImpianto(impianto: Impianto): void {
    if (!impianto.idImpianto) return;

    const dialogRef = this.dialog.open(ConfermaDialogComponent, {
      width: '400px',
      data: { codiceCabina: impianto.codiceCabina }
    });

    dialogRef.afterClosed().subscribe((confermato: boolean) => {
      if (confermato) {
        this.impiantoService.deleteImpianto(impianto)
          .subscribe(() => {
            this.cerca();
          });
      }
    });
  }


}