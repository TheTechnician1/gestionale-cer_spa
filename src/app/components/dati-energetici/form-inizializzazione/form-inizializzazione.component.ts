import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DatiEnergeticiModel } from 'src/app/core/interfaces/dati-energetici.model';
import { DatiEnergeticiService } from '../../services/dati-energetici.service';

@Component({
  selector: 'app-form-inizializzazione',
  template: `
    <app-dati-energetici-form
      [datiForm]="nuovoRecord"
      [modalitaVisualizzazione]="false"
      (salva)="salvaNuovoRecord($event)"
      (chiudi)="tornaIndietro()"
    ></app-dati-energetici-form>
  `,
  styleUrls: ['./form-inizializzazione.component.scss'],
})
export class FormInizializzazioneComponent implements OnInit {
  nuovoRecord!: DatiEnergeticiModel;

  constructor(
    private service: DatiEnergeticiService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.nuovoRecord = {
      idDati: null,
      idCer: null,
      idConfigurazione: null,
      anno: '',
      energiaProdotta: 0,
      energiaPrelevata: 0,
      energiaImmessa: 0,
      energiaCondivisa: 0,
      flgCancellazione: 'N',
    } as any;
  }

  salvaNuovoRecord(formValue: any): void {
    this.service.createDatiEnergetici(formValue).subscribe({
      next: () => this.tornaIndietro(),
      error: (err) => console.error('Errore creazione:', err),
    });
  }

  tornaIndietro(): void {
    this.router.navigate(['dati-energetici']);
  }
}
