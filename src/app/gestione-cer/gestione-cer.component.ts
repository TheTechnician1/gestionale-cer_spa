import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-gestione-cer',
  templateUrl: './gestione-cer.component.html',
  styleUrls: ['./gestione-cer.component.scss']
})
export class GestioneCERComponent {

 formRicerca: FormGroup;

 elencoFormaGiuridica: string[] = ['Associazione non riconosciuta', 'Associazione riconosciuta', 'Società di capitali', 'Cooperativa', 'Fondazione di partecipazione'];

 elencoStato: string[] = ["NO-AUT-NO-GSE", "NO-AUT-SI-GSE", "SI-AUT"];

 elencoFlag: string[] = ["Flag Iscrizione RUNTS",
"Flag accesso soggetti svantaggiati",
"Flag montane o interne",
"Flag Progetti di inclusione",
"Flag terzo settore",
"Flag cambiamenti climatici"
];

 constructor(private costruttoreForm: FormBuilder) {
     this.formRicerca = this.costruttoreForm.group(
     ragioneSociale: [''],
     partitaIVA: [''],
     formaGiuridica: [''],
     stato: ['']
     flag: ['']
     );
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

    const datiRicerca = {
      ragioneSociale: this.ragioneSociale.value,
      partitaIVA: this.partitaIVA.value,
      formaGiuridica: this.formaGiuridica.value,
      stato: this.stato.value,
      flag: this.flag.value
    };

    console.log('Dati di ricerca:', datiRicerca);

    this.formRicerca.reset();
  }
}