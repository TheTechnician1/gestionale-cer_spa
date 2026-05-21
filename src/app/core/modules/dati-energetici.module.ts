import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { DatiEnergeticiRoutingModule } from './dati-energetici-routing.module';
import { DatiEnergeticiFormComponent } from 'src/app/components/dati-energetici/dati-energetici-form/dati-energetici-form.component';
import { DatiEnergeticiRicercaComponent } from 'src/app/components/dati-energetici/dati-energetici-ricerca/dati-energetici-ricerca.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { ConfermaDialogComponent } from 'src/app/components/dati-energetici/dialog/dialog.component';
import { FormInizializzazioneComponent } from 'src/app/components/dati-energetici/form-inizializzazione/form-inizializzazione.component';
import { FormModificaComponent } from 'src/app/components/dati-energetici/form-modifica/form-modifica.component';
import { VisualizzaComponent } from 'src/app/components/dati-energetici/visualizza/visualizza.component';

@NgModule({
  declarations: [
    DatiEnergeticiRicercaComponent,
    DatiEnergeticiFormComponent,
    ConfermaDialogComponent,
    FormInizializzazioneComponent,
    FormModificaComponent,
    VisualizzaComponent,
  ],
  schemas: [],
  exports: [],
  imports: [
    SharedModule,
    DatiEnergeticiRoutingModule,
    CommonModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
  ],
})
export class DatiEnergeticiModule {}
