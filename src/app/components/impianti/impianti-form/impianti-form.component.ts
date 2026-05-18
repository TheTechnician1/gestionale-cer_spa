import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

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

  constructor( private fb: FormBuilder, private route: ActivatedRoute,) {}

  ngOnInit(): void {

    const id = this.route.snapshot.paramMap.get('id');
    console.log(id);
    

    this.buildForm();

    this.idImpianto = this.route.snapshot.paramMap.get('id');
    this.isEditMode = !!this.idImpianto;

    if (this.isEditMode) {
      this.titoloPagina = 'Modifica Impianto';
      this.loadMockForEdit();
    } else {
      this.titoloPagina = 'Nuovo Impianto';
    }

  }

  private loadMockForEdit(): void {
    const impiantoMock = {
      tipologia: 'Fotovoltaico',
      potenzaNominale: 12.5,
      regione: 'Lazio',
      comune: 'Roma',
      indirizzo: 'Via Appia',
      cap: '00179',
      partitaIva: '12345678901',
      flgAccumulo: true,
    };

    this.impiantoForm.patchValue(impiantoMock);
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

  salvaBozza(): void {
    if (this.impiantoForm.invalid) {
      this.impiantoForm.markAllAsTouched();
      return;
    }

    console.log('valori form impianto:', this.impiantoForm.value);
  }

  resetForm(): void {
    this.impiantoForm.reset({
      flgAccumulo: false,
    });
  }
}
