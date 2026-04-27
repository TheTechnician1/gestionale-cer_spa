import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CERService } from '../../services/cer.service';
import { CER } from '../../interfaces/cer.model';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-inserimento-configurazione',
  templateUrl: './inserimento-configurazione.component.html',
  styleUrls: ['./inserimento-configurazione.component.scss'],
})
export class InserimentoConfigurazioneComponent implements OnInit {

  configForm!: FormGroup;

  constructor(private fb: FormBuilder, private snackBar: MatSnackBar, private cerService: CERService, private route: ActivatedRoute) {}
   cer?: CER;
   cers : CER [] = []

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.configForm = this.fb.group({
      codiceCabina: ['', [Validators.required]],
      annoAttivazione: ['', [Validators.required]],
      ragSociale: ['', [Validators.required]]
    });
    this.configForm.enable();
    this.loadCER(parseInt(id!));
  }

  loadCER(id: number) {
    this.cerService.getCER(id).subscribe({
      next: (cer) => {
      this.cer = cer[0];
      },
      error: (error) => {
        console.error("Login error", error);
      }
    });
  }

  submitted = false;

  submit() {
    this.submitted = true;

    if (this.configForm.invalid) {
      this.configForm.markAllAsTouched();

      this.snackBar.open(
        'Compila tutti i campi obbligatori correttamente',
        'Chiudi',
        { duration: 3000 }
      );
      return;
    }

    this.snackBar.open(
      'Inserimento completato!',
      'OK',
      { duration: 2000 }
    );
    console.log(this.configForm.value);
  }

}
