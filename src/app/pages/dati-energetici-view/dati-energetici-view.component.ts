import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DatiEnergeticiService } from 'src/app/components/services/dati-energetici.service';
import { DatiEnergeticiView } from 'src/app/core/interfaces/dati-energetici-view';
import { DatiEnergetici } from 'src/app/core/interfaces/dati-energetici.model';

@Component({
  selector: 'app-dati-energetici-view',
  templateUrl: './dati-energetici-view.component.html',
  styleUrls: ['./dati-energetici-view.component.scss']
})
export class DatiEnergeticiViewComponent implements OnInit {

  dettaglio: DatiEnergeticiView | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private datiService: DatiEnergeticiService
  ) {}

  ngOnInit(): void {

    const idParam = this.route.snapshot.paramMap.get('id');

    if (!idParam) {
      console.error('ID non presente nella rotta');
      return;
    }

    const id = Number(idParam);

    this.datiService.getDato(id).subscribe({
      next: (dato) => {
        if (dato) {
          this.dettaglio = dato;
        } else {
          console.warn('Dato non trovato');
          this.dettaglio = null;
        }
      },
      error: (err) => {
        console.error('Errore caricamento dettaglio:', err);
        this.dettaglio = null;
      }
    });
  }

  tornaIndietro(): void {
    this.router.navigate(['/dati-energetici']);
  }
}