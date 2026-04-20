import { Component, inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { CerElemento, CerFiltro, FiltroService } from '../core/services/filtro.service';

@Component({
  selector: 'app-form-ricerca-cer',
  templateUrl: './form-ricerca-cer.component.html',
  styleUrls: ['./form-ricerca-cer.component.scss']
})
export class FormRicercaCerComponent {
 formRicerca: FormGroup;
 risultatiFiltrati: CerElemento[] = [];

 elencoFormaGiuridica: string[] = ['Associazione non riconosciuta', 'Associazione riconosciuta', 'Società di capitali', 'Cooperativa', 'Fondazione di partecipazione'];

 elencoStato: string[] = ["NO-AUT-NO-GSE", "NO-AUT-SI-GSE", "SI-AUT"];

 elencoFlag: string[] = ["Flag Iscrizione RUNTS",
"Flag accesso soggetti svantaggiati",
"Flag montane o interne",
"Flag Progetti di inclusione",
"Flag terzo settore",
"Flag cambiamenti climatici"
];

 private filtroService = inject(FiltroService);

 constructor(private costruttoreForm: FormBuilder) {
     this.formRicerca = this.costruttoreForm.group(
    {
     ragioneSociale: [''],
     partitaIVA: [''],
     formaGiuridica: [''],
     stato: [''],
     flag: ['']
    }
  );

    this.risultatiFiltrati = this.filtroService.getListaElementi();
   }  


    get ragioneSociale(): FormControl {
    return this.formRicerca.get('ragioneSociale') as FormControl;
 }

    get partitaIVA(): FormControl {
    return this.formRicerca.get('partitaIVA') as FormControl;
 }

    get formaGiuridica(): FormControl {
    return this.formRicerca.get('formaGiuridica') as FormControl;
 }

    get stato(): FormControl {
    return this.formRicerca.get('stato') as FormControl;
 }

    get flag(): FormControl {
    return this.formRicerca.get('flag') as FormControl;
 }

 inviaModulo(): void {
    if (this.formRicerca.invalid) {
      this.formRicerca.markAllAsTouched();
      return;
    }

    const datiRicerca: CerFiltro = {
      ragioneSociale: this.ragioneSociale.value,
      partitaIVA: this.partitaIVA.value,
      formaGiuridica: this.formaGiuridica.value,
      stato: this.stato.value,
      flag: this.flag.value
    };

    console.log('Dati di ricerca:', datiRicerca);

    this.risultatiFiltrati = this.filtroService.filtraElementi(datiRicerca);
  }

  resetFiltri(): void {
    this.formRicerca.reset();
    this.risultatiFiltrati = this.filtroService.getListaElementi();
  }
}
