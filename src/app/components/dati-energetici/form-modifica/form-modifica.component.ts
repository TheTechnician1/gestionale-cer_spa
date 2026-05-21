import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { DatiEnergeticiModel } from 'src/app/core/interfaces/dati-energetici.model';
import { DatiEnergeticiService } from '../../services/dati-energetici.service';

@Component({
  selector: 'app-form-modifica',
  template: `
    <div
      *ngIf="loading"
      style="display: flex; justify-content: center; padding: 60px;"
    >
      <mat-spinner diameter="40"></mat-spinner>
    </div>

    <app-dati-energetici-form
      *ngIf="!loading"
      [datiForm]="recordDaModificare"
      [modalitaVisualizzazione]="false"
      (salva)="aggiornaRecord($event)"
      (chiudi)="tornaIndietro()"
    ></app-dati-energetici-form>
  `,
  styleUrls: ['./form-modifica.component.scss'],
})
export class FormModificaComponent implements OnInit {
  recordDaModificare!: DatiEnergeticiModel;
  loading = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private service: DatiEnergeticiService,
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.service.getDato(+id).subscribe({
        next: (data: DatiEnergeticiModel[]) => {
          if (data && data.length > 0) {
            this.recordDaModificare = data[0];
            this.loading = false;
          } else {
            this.tornaIndietro();
          }
        },
        error: (err) => {
          console.error('Errore getDato:', err);
          this.tornaIndietro();
        },
      });
    }
  }

  aggiornaRecord(formValue: DatiEnergeticiModel): void {
    this.service.editDatiEnergetici(formValue).subscribe({
      next: () => this.tornaIndietro(),
      error: (err) => console.error('Errore modifica:', err),
    });
  }

  tornaIndietro(): void {
    this.router.navigate(['/dati-energetici']);
  }
}
