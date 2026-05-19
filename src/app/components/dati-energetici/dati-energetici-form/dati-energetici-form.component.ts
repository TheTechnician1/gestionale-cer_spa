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
export class DatiEnergeticiFormComponent {
  idModello!: number;
  modalitaModifica: boolean = false;
  // modalitaVisualizzazione: boolean = false;
  @Input() datiForm!: DatiEnergetici;
  @Input() modalitaVisualizzazione: boolean = false;

  @Output() chiudi = new EventEmitter<void>();
  @Output() cancella = new EventEmitter<DatiEnergetici>();

  energiaForm!: FormGroup;

  annullaOChiudi(): void {
    this.chiudi.emit();
  }

  constructor(
    private datiEnergeticiService: DatiEnergeticiService,
    private fb: FormBuilder,
  ) {
    this.inizializzaFormVuoto();
  }

  private inizializzaFormVuoto() {
    this.energiaForm = this.fb.group({
      idDati: [null],
      anno: ['', [Validators.required, Validators.pattern('^[0-3][0-9]{3}$')]],
      eProdotta: [0, [Validators.required, Validators.min(0)]],
      ePrelevata: [0, [Validators.required, Validators.min(0)]],
      eImmessa: [0, [Validators.required, Validators.min(0)]],
      eCondivisa: [0, [Validators.required, Validators.min(0)]],
      eAutoCons: [0, [Validators.min(0)]],
      statoScheda: ['ATTIVO'],
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

  gestisciCancellazioneLocale(): void {
    this.cancella.emit(this.datiForm);
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

    if (finalPayload.idDati) {
      this.datiEnergeticiService.editDatiEnergetici(finalPayload).subscribe({
        next: () => this.chiudi.emit(),
      });
    } else {
      this.datiEnergeticiService.createDatiEnergetici(finalPayload).subscribe({
        next: () => this.chiudi.emit(),
      });
    }
  }
}
