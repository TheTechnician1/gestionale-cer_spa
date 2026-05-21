import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DatiEnergetici } from 'src/app/core/interfaces/dati-energetici.model';
import { DatiEnergeticiService } from '../../services/dati-energetici.service';
import { DatiEnergeticiFormComponent } from '../dati-energetici-form/dati-energetici-form.component';

@Component({
  selector: 'app-dati-energetici-dettaglio',
  template: `
    <div
      *ngIf="loading"
      style="display: flex; justify-content: center; padding: 60px;"
    >
      <mat-spinner diameter="40"></mat-spinner>
    </div>

    <app-dati-energetici-form
      *ngIf="!loading"
      [datiForm]="recordDettaglio"
      [modalitaVisualizzazione]="true"
      (chiudi)="tornaIndietro()"
    ></app-dati-energetici-form>
  `,
})
export class VisualizzaComponent implements OnInit {
  recordDettaglio!: DatiEnergetici;
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
        next: (data: DatiEnergetici[]) => {
          if (data && data.length > 0) {
            this.recordDettaglio = data[0];
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

  tornaIndietro(): void {
    this.router.navigate(['/dati-energetici']);
  }
}
