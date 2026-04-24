import { Component, OnInit, TemplateRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { LoginService } from '../core/services/login.service';
import { GetListaCER, ImpiantoCER } from '../core/interfaces/user.model';

@Component({
  selector: 'app-dettagli-tabella-cer',
  templateUrl: './dettagli-tabella-cer.component.html',
  styleUrls: ['./dettagli-tabella-cer.component.scss'],
})
export class DettagliTabellaCerComponent implements OnInit {
  cer?: GetListaCER;
  impianti: ImpiantoCER[] = [];
  impiantoSelezionato?: ImpiantoCER;
  displayedColumns: string[] = [
    'codiceCabina',
    'tipologia',
    'dataEsercizio',
    'comune',
    'azioni',
  ];

  constructor(
    private route: ActivatedRoute,
    private login: LoginService,
    private dialog: MatDialog
  ) {}

  isAdmin(): boolean {
    return this.login.isGranted() === 'ADMIN';
  }
  apriDettaglioImpianto(
    impianto: ImpiantoCER,
    dettaglioImpiantoDialog: TemplateRef<unknown>
  ): void {
    this.impiantoSelezionato = impianto;
    this.dialog.open(dettaglioImpiantoDialog, {
      width: '720px',
      maxWidth: '95vw',
    });
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const cerId = Number(params.get('id'));
      const impiantoId = Number(params.get('impiantoId'));

      if (!cerId) {
        return;
      }

      this.login.visualizzaCer(cerId).subscribe({
        next: (cer) => {
          this.cer = cer;
          this.caricaImpianti(cer, impiantoId);
        },
      });
    });
  }

  comuneImpianto(impianto: ImpiantoCER): string {
    const ubicazione = impianto.ubicazioni?.[0];
    return ubicazione?.comuneNome || ubicazione?.comune || '';
  }

  provinciaImpianto(impianto: ImpiantoCER): string {
    return impianto.ubicazioni?.[0]?.provincia || '';
  }

  sitoInstallazione(impianto: ImpiantoCER): string {
    return impianto.ubicazioni?.[0]?.sitoInstallazione || '';
  }

  private caricaImpianti(cer: GetListaCER, impiantoId: number): void {
    this.login.ricercaImpianti({
      partitaIva: cer.partitaIVA,
      regione: cer.regioneLegale,
      provincia: cer.provinciaSedeLegale,
      comune: cer.comuneSedeLegale,
    }).subscribe({
      next: (impianti) => {
        this.impianti = impianti;
        this.impiantoSelezionato = impianti.find(
          (impianto) => impianto.idImpianto === impiantoId
        );
      },
      error: () => {
        this.impianti = [];
      },
    });
  }
}
