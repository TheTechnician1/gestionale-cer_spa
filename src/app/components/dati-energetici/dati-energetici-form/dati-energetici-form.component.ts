import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DatiEnergeticiService } from '../../services/dati-energetici.service';
import { DatiEnergetici } from 'src/app/core/interfaces/dati-energetici.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-dati-energetici-form',
  templateUrl: './dati-energetici-form.component.html',
  styleUrls: ['./dati-energetici-form.component.scss'],
})
export class DatiEnergeticiFormComponent implements OnChanges {
  // idModello!: number;
  // modalitaModifica: boolean = false;
  // modalitaVisualizzazione: boolean = false;
  @Input() datiForm!: DatiEnergetici;
  @Input() modalitaVisualizzazione: boolean = false;

  @Output() salva = new EventEmitter<any>();
  @Output() chiudi = new EventEmitter<void>();
  @Output() cancella = new EventEmitter<DatiEnergetici>();

  energiaForm!: FormGroup;

  constructor(
    private datiEnergeticiService: DatiEnergeticiService,
    private fb: FormBuilder,
  ) {
    this.inizializzaFormVuoto();
  }

  private inizializzaFormVuoto() {
    this.energiaForm = this.fb.group({
      idDati: [null],
      idCer: [null],
      idConfigurazione: [null],
      anno: ['', [Validators.required, Validators.pattern('^[0-9]{4}$')]],
      energiaProdotta: [0, [Validators.required, Validators.min(0)]],
      energiaPrelevata: [0, [Validators.required, Validators.min(0)]],
      energiaImmessa: [0, [Validators.required, Validators.min(0)]],
      energiaCondivisa: [0, [Validators.required, Validators.min(0)]],
      energiaAutoCons: [0],
      tariffaPremium: [0],
      corrPremioOtt: [0],
      ridEmCo2: [''],
      flgCancellazione: ['N'],
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['datiForm'] && this.datiForm) {
      this.energiaForm.patchValue(this.datiForm);

      if (this.modalitaVisualizzazione) {
        this.energiaForm.disable();
      } else {
        this.energiaForm.enable();
      }
    }
  }

  // salvaOggetto(): void {
  //   if (this.modalitaModifica) {
  //     this.datiEnergeticiService.editDatiEnergetici(this.datiForm).subscribe({
  //       next: () => {
  //         this.chiudi.emit();
  //       },
  //     });
  //   } else {
  //     this.datiEnergeticiService.createDatiEnergetici(this.datiForm).subscribe({
  //       next: () => {
  //         this.chiudi.emit();
  //       },
  //     });
  //   }
  // }

  salvaOggetto(): void {
    if (this.energiaForm.invalid) {
      this.energiaForm.markAllAsTouched();
      return;
    }

    const finalPayload: DatiEnergetici = this.energiaForm.getRawValue();
    this.salva.emit(finalPayload);
  }

  annullaOChiudi(): void {
    this.chiudi.emit();
  }

  gestisciCancellazioneLocale(): void {
    this.cancella.emit(this.datiForm);
  }
}
