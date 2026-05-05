import { AfterViewInit, Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ConfigurazioneCabina, ImpiantoCER } from '../core/interfaces/user.model';
import { ConfigurazioneCabinaService } from '../core/services/configurazione-cabina.service';

@Component({
  selector: 'app-configurazioni-disattivate',
  templateUrl: './configurazioni-disattivate.component.html',
  styleUrls: ['./configurazioni-disattivate.component.scss'],
})
export class ConfigurazioniDisattivateComponent implements OnInit, AfterViewInit {
  formRicerca: FormGroup;
  dataSource = new MatTableDataSource<ConfigurazioneCabina>();
  configurazioneSelezionata?: ConfigurazioneCabina;
  caricamento = false;

  readonly displayedColumns = [
    'codiceCabina',
    'cer',
    'annoAttivazione',
    'stato',
    'azioni',
  ];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private configurazioneService: ConfigurazioneCabinaService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {
    this.formRicerca = this.configurazioneService.creaFormRicerca();
  }

  ngOnInit(): void {
    this.cerca();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  cerca(): void {
    const payload = this.configurazioneService.normalizzaRicerca(this.formRicerca);
    this.caricamento = true;

    this.configurazioneService.ricercaDisattivate(payload).subscribe({
      next: (risultati) => {
        this.impostaRisultati(risultati);
      },
      error: (errore) => {
        this.dataSource.data = [];
        this.caricamento = false;
        this.mostraMessaggio(
          errore?.error || 'Errore durante la ricerca delle configurazioni disattivate.'
        );
      },
    });
  }

  resetFiltri(): void {
    this.formRicerca.reset({
      daAnno: null,
      getaAnno: null,
      ragSociale: '',
      partitaIva: '',
      descRegione: '',
      codiceCabina: '',
      annoAttivazione: null,
    });
    this.cerca();
  }

  apriDettaglio(
    configurazione: ConfigurazioneCabina,
    template: TemplateRef<unknown>
  ): void {
    this.configurazioneSelezionata = configurazione;
    this.dialog.open(template, { width: '820px', maxWidth: '95vw' });
  }

  idConfigurazione(configurazione: ConfigurazioneCabina): number | null {
    return this.configurazioneService.idConfigurazione(configurazione);
  }

  stato(configurazione: ConfigurazioneCabina): string {
    return this.configurazioneService.stato(configurazione);
  }

  codiceCabina(configurazione: ConfigurazioneCabina): string {
    return this.configurazioneService.codiceCabina(configurazione);
  }

  ragioneSocialeCer(configurazione: ConfigurazioneCabina): string {
    return configurazione.cer?.ragioneSociale || '-';
  }

  impianti(configurazione: ConfigurazioneCabina): ImpiantoCER[] {
    return configurazione.impianti ?? [];
  }

  private impostaRisultati(configurazioni: ConfigurazioneCabina[]): void {
    this.dataSource.data = configurazioni.filter((configurazione) =>
      this.configurazioneService.configurazioneDisattiva(configurazione)
    );
    this.dataSource.paginator?.firstPage();
    this.caricamento = false;
  }

  private mostraMessaggio(messaggio: string): void {
    this.snackBar.open(messaggio, 'Chiudi', {
      duration: 4500,
      horizontalPosition: 'end',
      verticalPosition: 'top',
    });
  }
}
