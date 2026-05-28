import { Component, OnInit } from "@angular/core";
import { FormGroup, FormControl } from '@angular/forms';
import { ImpiantoService } from '../../services/impianto.service';
import { catchError, tap } from 'rxjs/operators';
import { of } from 'rxjs';
import { Impianto } from "src/app/core/interfaces/impianto.model";
import { StatoImpianto } from "src/app/core/enum/stato-impianto.enum";
import { ConfermaDialogComponent } from "../../dati-energetici/dialog/dialog.component";
import { MatDialog } from "@angular/material/dialog";
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { Router, ActivatedRoute, NavigationEnd } from "@angular/router";
import { filter } from 'rxjs/operators';
import { UtenteService } from "src/app/core/services/utente.service";
import { Ruolo } from "src/app/core/enum/role.enum";
import { ToastService } from "src/app/core/services/toast.service";

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
    idConfigurazione: new FormControl(null),
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
  isGest: boolean = false;

  constructor(
    private impiantoService: ImpiantoService,
    private dialog: MatDialog,
    private router: Router,
    private route: ActivatedRoute,
    private utenteService: UtenteService,
    private toastService :ToastService
  ) {}

  ngOnInit(): void {
  this.isAdmin = this.utenteService.getRole()?.toUpperCase() === Ruolo.ADMIN.toUpperCase();
  this.isGest = this.utenteService.getRole()?.toUpperCase() === Ruolo.GEST.toUpperCase();

  this.router.events.pipe(
    filter(event => event instanceof NavigationEnd)
  ).subscribe(() => {
    this.figlioAttivo = this.route.children.length > 0;
    if (!this.figlioAttivo) {
      this.cerca();
    }
  });

  this.route.queryParams.subscribe(params => {
    if (params['refresh']) {
      this.cerca();
    }
  });

  this.cerca();
}

  cerca(): void {
    let cleanedPayload = Object.fromEntries(
      Object.entries(this.form.getRawValue()).filter(([_, value]) => value !== null && value !== '')
    );
    this.impiantoService.getImpianti(cleanedPayload)
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

  const idImpianto = impianto.idImpianto;
  const codiceCabina = impianto.codiceCabina;

  const dialogRef = this.dialog.open(ConfermaDialogComponent, {
    width: '400px',
    data: { codiceCabina }
  });

  dialogRef.afterClosed().subscribe((confermato: boolean) => {
    if (confermato) {
      const email = (this.utenteService.currentUser as any)?.utente?.mail ?? '';

      console.log('DELETE payload:', { idImpianto, email });

      if (!email) {
        this.toastService.error('Utente non autenticato');
        return;
      }

      this.impiantoService.deleteImpianto(idImpianto, email)
        .subscribe(() => {
          this.cerca();
        });
    }
  });
}
}