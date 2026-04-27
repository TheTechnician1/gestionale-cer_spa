import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { DatiEnergetici } from '../../interfaces/dati-energetici.model';
import { DatiEnergeticiService } from '../../services/dati-energetici.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-dettaglio-dati-energetici',
  templateUrl: './dettaglio-dati-energetici.component.html',
  styleUrls: ['./dettaglio-dati-energetici.component.scss']
})
export class DettaglioDatiEnergeticiComponent implements OnInit {
  constructor(private fb: FormBuilder, private dati: DatiEnergeticiService, private route: ActivatedRoute) {}

  datiEnergetici?: DatiEnergetici;
  datiEnergeticiForm!: FormGroup;

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.datiEnergeticiForm = this.fb.group({
      anno: ['', [Validators.required]],
      energiaProdotta: ['', [Validators.required]],
      energiaPrelevata: ['', [Validators.required]],
      energiaImmessa: ['', [Validators.required]],
      energiaCondivisa: ['', [Validators.required]],
      energiaAutoCons: ['', [Validators.required]],
      tariffaPremium: ['', [Validators.required]],
      corrPremioOtt: ['', [Validators.required]],
      ridEmCo2: ['', [Validators.required]],
      flgCancellazione: [''],
      ragioneSociale: [''],
      codiceCabina: ['']
    });
    this.datiEnergeticiForm.disable();
    this.loadDati(parseInt(id!));
  }

  loadDati(id: number) {
    this.dati.getDato(id).subscribe({
      next: (dato) => {
        this.datiEnergetici = dato[0];

        if(this.datiEnergeticiForm) {
          this.datiEnergeticiForm.patchValue({
            anno: this.datiEnergetici.anno,
            energiaProdotta: this.datiEnergetici.energiaProdotta,
            energiaPrelevata: this.datiEnergetici.energiaPrelevata,
            energiaImmessa: this.datiEnergetici.energiaImmessa,
            energiaCondivisa: this.datiEnergetici.energiaCondivisa,
            energiaAutoCons: this.datiEnergetici.energiaAutoCons,
            tariffaPremium: this.datiEnergetici.tariffaPremium,
            corrPremioOtt: this.datiEnergetici.corrPremioOtt,
            ridEmCo2: this.datiEnergetici.ridEmCo2,
            flgCancellazione: this.datiEnergetici.flgCancellazione,
            ragioneSociale: this.datiEnergetici.configurazioneCer?.ragioneSociale,
            codiceCabina: this.datiEnergetici.configurazioneCer?.codiceCabina
          })
        }
      },
      error: (err) => {
        console.log("Errore imprevisto: ", err);
      }
    })
  }
}
