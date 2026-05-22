import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DatiEnergeticiService } from '../../services/dati-energetici.service';
import { ToastService } from 'src/app/core/services/toast.service';
import { UtenteService } from 'src/app/core/services/utente.service';

@Component({
  selector: 'app-form-modifica',
  templateUrl: './form-modifica.component.html',
  styleUrls: ['./form-modifica.component.scss'],
})
export class FormModificaComponent implements OnInit {
  idRecord!: number;
  loading = true;
  recordDaModificare: any = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private service: DatiEnergeticiService,
    private toast: ToastService,
    private utenteService: UtenteService,
  ) {}

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    this.idRecord = idParam ? Number(idParam) : 0;

    this.caricaDatiEsistenti();
  }

  private caricaDatiEsistenti(): void {
    if (this.idRecord === 0) {
      this.toast.error('ID record non valido.');
      this.loading = false;
      return;
    }

    this.loading = true;
    this.service.getDato(this.idRecord).subscribe({
      next: (res) => {
        const data = Array.isArray(res) ? res[0] : res;
        this.recordDaModificare = data;
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.toast.error('Errore nel recupero dei dati correnti');
        this.loading = false;
      },
    });
  }

  aggiornaRecord(formBody: any): void {
    this.loading = true;

    // 3. Extract the logged-in user email string safely from the nested session payload
    const emailLoggato = this.utenteService.currentUser?.utente?.email || '';

    // 4. Pass the emailLoggato string as the 3rd argument to clear the signature requirements
    this.service
      .editDatiEnergetici(this.idRecord, formBody, emailLoggato)
      .subscribe({
        next: (messaggio) => {
          this.toast.success(messaggio || 'Modifica completata con successo!');
          this.tornaIndietro();
        },
        error: (err) => {
          console.error(err);
          this.toast.error('Errore durante il salvataggio delle modifiche');
          this.loading = false;
        },
      });
  }

  tornaIndietro(): void {
    this.router.navigate(['/dati-energetici']);
  }
}
