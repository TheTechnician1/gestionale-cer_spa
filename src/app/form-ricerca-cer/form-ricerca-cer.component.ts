import { Component, EventEmitter, OnInit, Output, inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { CerElemento, CerFiltro, FiltroService } from '../core/services/filtro.service';

@Component({
  selector: 'app-form-ricerca-cer',
  templateUrl: './form-ricerca-cer.component.html',
  styleUrls: ['./form-ricerca-cer.component.scss']
})
export class FormRicercaCerComponent implements OnInit {
 @Output() risultatiFiltratiChange = new EventEmitter<CerElemento[]>();

 formRicerca: FormGroup;
 risultatiFiltrati: CerElemento[] = [];

 elencoFormaGiuridica: string[] = [
  'Associazione',
  'Associazione non riconosciuta',
  'Associazione riconosciuta',
  'Cooperativa',
  'Consorzio',
  'Fondazione di partecipazione',
  'Societa di capitali'
 ];

 private filtroService = inject(FiltroService);

  constructor(private costruttoreForm: FormBuilder) {
     this.formRicerca = this.costruttoreForm.group(
    {
     ragioneSociale: [''],
     partitaIVA: [''],
     formaGiuridica: [''],
     comune: [''],
     provincia: [''],
     regione: ['']
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

  get comune(): FormControl {
    return this.formRicerca.get('comune') as FormControl;
 }

  get provincia(): FormControl {
    return this.formRicerca.get('provincia') as FormControl;
 }

  get regione(): FormControl {
    return this.formRicerca.get('regione') as FormControl;
 }

 inviaModulo(): void {
    if (this.formRicerca.invalid) {
      this.formRicerca.markAllAsTouched();
      return;
    }

    const datiRicerca: CerFiltro = {
      ragioneSociale: this.ragioneSociale.value ?? '',
      partitaIVA: this.partitaIVA.value ?? '',
      formaGiuridica: this.formaGiuridica.value ?? '',
      comune: this.comune.value ?? '',
      provincia: this.provincia.value ?? '',
      regione: this.regione.value ?? ''
    };

    console.log('Dati di ricerca:', datiRicerca);

    this.risultatiFiltrati = this.filtroService.filtraElementi(datiRicerca);
    this.risultatiFiltratiChange.emit(this.risultatiFiltrati);
  }

  resetFiltri(): void {
    this.formRicerca.reset({
      ragioneSociale: '',
      partitaIVA: '',
      formaGiuridica: '',
      comune: '',
      provincia: '',
      regione: '',
    });
    this.risultatiFiltrati = this.filtroService.getListaElementi();
    this.risultatiFiltratiChange.emit(this.risultatiFiltrati);
  }
}
