import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DashboardService } from '../../services/dashboard.service';

@Component({
  selector: 'app-dettaglio-cer',
  templateUrl: './dettaglio-cer.component.html',
  styleUrls: ['./dettaglio-cer.component.scss'],
})
export class DettaglioCerComponent implements OnInit {
  idCer!: number;
  cerData: any = null;
  isLoading = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private dashboardService: DashboardService,
  ) {}

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.idCer = Number(idParam);
      this.loadCerDetails();
    } else {
      this.goBack();
    }
  }

  loadCerDetails(): void {
    this.isLoading = true;
    this.dashboardService.getCerById(this.idCer).subscribe({
      next: (res) => {
        if (res) {
          const data = res.data || res.cer || res;

          const formaDesc =
            data.formaGiuridica && typeof data.formaGiuridica === 'object'
              ? data.formaGiuridica.descrizione
              : data.formaGiuridica || '';

          const comDesc =
            data.comuneLegale && typeof data.comuneLegale === 'object'
              ? data.comuneLegale.descrizione
              : data.comune || '';

          const provDesc =
            data.provinciaLegale && typeof data.provinciaLegale === 'object'
              ? data.provinciaLegale.descrizione
              : data.provincia || '';

          const regDesc =
            data.regioneLegale && typeof data.regioneLegale === 'object'
              ? data.regioneLegale.descrizione
              : data.regione || '';

          this.cerData = {
            ...data,
            displayRagioneSociale: data.ragioneSociale || data.ragSociale || '',
            displayCodiceFiscale: data.codiceFiscale || data.codFisc || '',
            displayPartitaIva: data.partitaIva || data.pIva || '',
            displayFormaGiuridica: formaDesc,
            displayComune: comDesc,
            displayProvincia: provDesc,
            displayRegione: regDesc,
            displayEmail: data.email || '',
            displayPec: data.pec || '',
            displayReferente: data.referente || '',
          };
        }
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading details:', err);
        this.isLoading = false;
      },
    });
  }

  goBack(): void {
    this.router.navigate(['/dashboard']);
  }
}
