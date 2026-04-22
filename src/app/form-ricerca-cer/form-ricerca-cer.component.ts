import { Component, EventEmitter, OnInit, Output, inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { CerElemento, CerFiltro, FiltroService } from '../core/services/filtro.service';
import { LoginService } from '../core/services/login.service';

@Component({
  selector: 'app-form-ricerca-cer',
  templateUrl: './form-ricerca-cer.component.html',
  styleUrls: ['./form-ricerca-cer.component.scss']
})
export class FormRicercaCerComponent implements OnInit {
 @Output() risultatiFiltratiChange = new EventEmitter<CerElemento[]>();

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

  constructor(
    private costruttoreForm: FormBuilder,
    private login: LoginService
  ) {
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

  ngOnInit(): void {
    this.risultatiFiltratiChange.emit(this.risultatiFiltrati);
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

 isAdmin(): boolean {
    return this.login.isGranted() === 'ADMIN';
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
      stato: this.isAdmin() ? this.stato.value : '',
      flag: this.flag.value
    };

    console.log('Dati di ricerca:', datiRicerca);

    this.risultatiFiltrati = this.filtroService.filtraElementi(datiRicerca);
    this.risultatiFiltratiChange.emit(this.risultatiFiltrati);
  }

  resetFiltri(): void {
    this.formRicerca.reset();
    this.risultatiFiltrati = this.filtroService.getListaElementi();
    this.risultatiFiltratiChange.emit(this.risultatiFiltrati);
  }
}
