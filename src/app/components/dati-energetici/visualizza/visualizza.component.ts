import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DatiEnergeticiService } from '../../services/dati-energetici.service';
import { ToastService } from 'src/app/core/services/toast.service';

@Component({
  selector: 'app-visualizza',
  templateUrl: './visualizza.component.html',
  styleUrls: ['./visualizza.component.scss'],
})
export class VisualizzaComponent implements OnInit {
  idRecord!: number;
  loading = true;
  recordDettaglio: any = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private service: DatiEnergeticiService,
    private toast: ToastService,
  ) {}

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    this.idRecord = idParam ? Number(idParam) : 0;

    this.recuperaDettaglio();
  }

  recuperaDettaglio(): void {
    if (this.idRecord === 0) {
      this.toast.error('ID record non valido.');
      this.loading = false;
      return;
    }

    this.loading = true;
    this.service.getDato(this.idRecord).subscribe({
      next: (res) => {
        this.recordDettaglio = Array.isArray(res) ? res[0] : res;
        this.loading = false;
      },
      error: (err) => {
        console.error('Errore getDato:', err);
        this.toast.error(
          'Impossibile caricare il dettaglio della scheda energetica',
        );
        this.loading = false;
      },
    });
  }

  tornaIndietro(): void {
    this.router.navigate(['/dati-energetici']);
  }
}
