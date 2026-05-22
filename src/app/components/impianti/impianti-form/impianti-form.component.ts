import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ImpiantoService } from '../../services/impianto.service';

@Component({
  selector: 'app-impianti-form',
  templateUrl: './impianti-form.component.html',
  styleUrls: ['./impianti-form.component.scss'],
})
export class ImpiantiFormComponent implements OnInit {
  impiantoForm!: FormGroup;
  titoloPagina = 'Nuovo Impianto';
  isEditMode = false;
  idImpianto: string | null = null;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private impiantoService: ImpiantoService,
  ) {}

  ngOnInit(): void {
    this.buildForm();

    this.idImpianto = this.route.snapshot.paramMap.get('id');
    this.isEditMode = !!this.idImpianto;

    if (this.isEditMode) {
      this.titoloPagina = 'Modifica Impianto';
      this.caricaImpianto();
    } else {
      this.titoloPagina = 'Nuovo Impianto';
    }
  }

  private buildForm(): void {
    this.impiantoForm = this.fb.group({
      tipologia: [null, Validators.required],
      potenzaNominale: [null, [Validators.required, Validators.min(0)]],
      regione: [null, Validators.required],
      comune: [null, Validators.required],
      indirizzo: [null],
      cap: [null, [Validators.pattern(/^\d{5}$/)]],
      partitaIva: [null, [Validators.pattern(/^\d{11}$/)]],
      flgAccumulo: [false],
    });
  }

  private caricaImpianto(): void {
    const id = Number(this.idImpianto);

    this.impiantoService.getById(id).subscribe({
      next: (impianto) => {
        if (!impianto) {
          return;
        }
        this.impiantoForm.patchValue(impianto);
      },
      error: (err) => {
        console.error('Errore caricamento impianto:', err);
      },
    });
  }

  salvaBozza(): void {
    if (this.impiantoForm.invalid) {
      this.impiantoForm.markAllAsTouched();
      return;
    }

    const impianto = this.impiantoForm.value;

    if (this.isEditMode) {
      const id = Number(this.idImpianto);
      this.impiantoService.modifica(id, impianto).subscribe({
        next: () => this.tornaAllaLista(),
        error: (err) => console.error('Errore modifica:', err),
      });
    } else {
      this.impiantoService.inserisci(impianto).subscribe({
        next: () => this.tornaAllaLista(),
        error: (err) => console.error('Errore inserimento:', err),
      });
    }
  }

  private tornaAllaLista(): void {
    this.router.navigate(['/impianto']);
  }

  resetForm(): void {
    this.impiantoForm.reset({
      flgAccumulo: false,
    });
  }
}
