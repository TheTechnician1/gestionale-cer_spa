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

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    this.datiEnergeticiForm = this.fb.group({
      anno: ['', [Validators.required]],
      eProdotta: ['', [Validators.required]],
      ePrelevata: ['', [Validators.required]],
      eImmessa: ['', [Validators.required]],
      eCondivisa: ['', [Validators.required]],
      eAutoCons: ['', [Validators.required]],
      tariffaPremium: ['', [Validators.required]],
      corrPremioOtt: ['', [Validators.required]],
      ridEmCo2: ['', [Validators.required]],
      statoScheda: [''],
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
            eProdotta: this.datiEnergetici.eProdotta,
            ePrelevata: this.datiEnergetici.ePrelevata,
            eImmessa: this.datiEnergetici.eImmessa,
            eCondivisa: this.datiEnergetici.eCondivisa,
            eAutoCons: this.datiEnergetici.eAutoCons,
            tariffaPremium: this.datiEnergetici.tariffaPremium,
            corrPremioOtt: this.datiEnergetici.corrPremioOtt,
            ridEmCo2: this.datiEnergetici.ridEmCo2,
            statoScheda: this.datiEnergetici.statoScheda,
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
