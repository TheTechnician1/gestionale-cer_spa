import { Component, EventEmitter, OnInit, Output, inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { GetListaCER, RicercaCerRequest } from '../core/interfaces/user.model';
import { CerService } from '../core/services/cer.service';
import { LoginService } from '../core/services/login.service';

@Component({
  selector: 'app-form-ricerca-cer',
  templateUrl: './form-ricerca-cer.component.html',
  styleUrls: ['./form-ricerca-cer.component.scss']
})
export class FormRicercaCerComponent implements OnInit {
 @Output() risultatiFiltratiChange = new EventEmitter<GetListaCER[]>();

 formRicerca: FormGroup;
 risultatiFiltrati: GetListaCER[] = [];
 elencoFormaGiuridica: string[] = [];

 private loginService = inject(LoginService);
 private cerService = inject(CerService);

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
   }

  ngOnInit(): void {
    this.caricaListaCompleta();
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

    const datiRicerca: RicercaCerRequest = {
      ragioneSociale: this.ragioneSociale.value ?? '',
      partitaIva: this.partitaIVA.value ?? '',
      comuneSedeLegale: this.comune.value ?? '',
      provinciaLegale: this.provincia.value ?? '',
      regioneLegale: this.regione.value ?? ''
    };

    console.log('Dati di ricerca:', datiRicerca);

    this.cercaCer(datiRicerca, this.formaGiuridica.value ?? '');
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
    this.cercaCer({});
  }

  private cercaCer(payload: RicercaCerRequest, formaGiuridica: string = ''): void {
    this.loginService.getTabellaCER(payload).subscribe({
      next: (risultati) => {
        const risultatiFiltrati = this.cerService.filtraPerFormaGiuridica(
          risultati,
          formaGiuridica
        );
        this.risultatiFiltrati = risultatiFiltrati;
        this.risultatiFiltratiChange.emit(risultatiFiltrati);
      },
      error: () => {
        this.risultatiFiltrati = [];
        this.risultatiFiltratiChange.emit([]);
      },
    });
  }

  private caricaListaCompleta(): void {
    this.loginService.getTabellaCER({}).subscribe({
      next: (risultati) => {
        this.elencoFormaGiuridica = this.cerService.estraiFormeGiuridiche(risultati);
        this.risultatiFiltrati = risultati;
        this.risultatiFiltratiChange.emit(risultati);
      },
      error: () => {
        this.elencoFormaGiuridica = [];
        this.risultatiFiltrati = [];
        this.risultatiFiltratiChange.emit([]);
      },
    });
  }
}
