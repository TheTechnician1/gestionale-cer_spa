import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DatiEnergeticiService } from '../../services/dati-energetici.service';
import { ToastService } from 'src/app/core/services/toast.service';
import { UtenteService } from 'src/app/core/services/utente.service';
import { FormGroup } from '@angular/forms';

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

  aggiornaRecord(datiFormEmessi: any) {
    const currentRecordId =
      this.idRecord || Number(this.route.snapshot.paramMap.get('id'));

    // 🔍 DEBUG LOG: Print the user state to trace the exact email property name
    console.log(
      '=== DEBUG MODIFICA USER STATE ===',
      this.utenteService.currentUser,
    );

    const userState = this.utenteService.currentUser;

    // Dynamic property fallback checking
    const email =
      userState?.utente?.email ||
      userState?.utente?.mail ||
      userState?.email ||
      userState?.mail ||
      '';

    console.log('=== RESOLVED EMAIL FOR BACKEND ===', email);

    if (!email) {
      this.toast.error(
        'Impossibile procedere: Email utente loggato non trovata.',
      );
      return;
    }

    const finalFormPayload = {
      ...this.recordDaModificare,
      ...datiFormEmessi,
    };

    this.service
      .editDatiEnergetici(currentRecordId, finalFormPayload, email)
      .subscribe({
        next: (res) => {
          this.toast.success('Record aggiornato con successo!');
          this.tornaIndietro();
        },
        error: (err) => {
          console.error('Validation failure payload detail:', err);
          this.toast.error('Errore durante la modifica del record.');
        },
      });
  }

  tornaIndietro(): void {
    this.router.navigate(['/dati-energetici']);
  }
}
