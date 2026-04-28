import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CERService } from '../../services/cer.service';
import { ConfigurazioneService } from '../../services/configurazione.service';
import { CER } from '../../interfaces/cer.model';
import { ActivatedRoute } from '@angular/router';
import { ImpiantoService } from '../../services/impianto.service';

@Component({
  selector: 'app-inserimento-impianto',
  templateUrl: './inserimento-impianto.component.html',
  styleUrls: ['./inserimento-impianto.component.scss']
})
export class InserimentoImpiantoComponent implements OnInit {

  impiantiForm!: FormGroup;
  
  constructor(private fb: FormBuilder, private snackBar: MatSnackBar, private cerService: CERService, private configurazioneService: ConfigurazioneService, private impiantoService: ImpiantoService, private route: ActivatedRoute) {}
    cer?: CER;
    cers: CER[] = [];

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.impiantiForm = this.fb.group({
    ragSociale: ['', Validators.required],
    codiceCabina: ['', [Validators.required]],
    dataEserc: ['', [Validators.required]],
    codiceTipologia: ['', [Validators.required]],
    potenzaNominale: ['', [Validators.required]],
    presenza_accumulo: ['', [Validators.required]],
    capAccumulo: ['', [Validators.required]],
    tipoProduttore: ['', [Validators.required]],
    codCategoriaProduttore: ['', [Validators.required]],
    ubicazione: this.fb.group({
      regione: ['', [Validators.required]],
      provincia: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(2)]],
      comune: ['', [Validators.required]],
      indirizzo: ['', [Validators.required]],
      civico: ['', [Validators.required]],
      cap: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(5)]],
      specTipoInst: ['', [Validators.required]]
      })
    });
    this.impiantiForm.enable();
    this.loadCER(parseInt(id!));
  }

  loadCER(id: number) {
    this.cerService.getCER(id).subscribe({
      next: (cer) => {
      this.cer = cer[0];
      if(this.impiantiForm) {
        this.impiantiForm.patchValue({
          ragSociale: this.cer.ragSociale
        });
      }
      },
      error: (error) => {
        console.error("Login error", error);
      }
    });
  }

  submitted = false;

  submit() {
    this.submitted = true;

    if (this.impiantiForm.invalid) {
      this.impiantiForm.markAllAsTouched();

      this.snackBar.open(
        'Compila tutti i campi obbligatori correttamente',
        'Chiudi',
        { duration: 3000 }
      );
      return;
    }
    
    this.impiantoService.createImpianto(this.impiantiForm.value).subscribe({
      next: (res) => {
        this.snackBar.open(
          'Inserimento completato!',
          'OK',
          { duration: 2000 }
        );
        console.log('Salvato:', res);

        this.impiantiForm.reset();
        this.submitted = false;
      },
      error: (err) => {
        console.error(err);

        this.snackBar.open(
          'Errore durante il salvataggio',
          'Chiudi',
          { duration: 3000 }
        );
      }
    });
  }
}
