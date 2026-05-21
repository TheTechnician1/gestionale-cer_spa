import { Routes } from '@angular/router';
import { AuthGuard } from '../guard/auth.guard';
import { DatiEnergeticiRicercaComponent } from 'src/app/components/dati-energetici/dati-energetici-ricerca/dati-energetici-ricerca.component';
import { DatiEnergeticiFormComponent } from 'src/app/components/dati-energetici/dati-energetici-form/dati-energetici-form.component';
import { FormInizializzazioneComponent } from 'src/app/components/dati-energetici/form-inizializzazione/form-inizializzazione.component';
import { FormModificaComponent } from 'src/app/components/dati-energetici/form-modifica/form-modifica.component';
import { VisualizzaComponent } from 'src/app/components/dati-energetici/visualizza/visualizza.component';

export const DATI_ENERGETICI_ROUTES: Routes = [
  {
    path: '',
    component: DatiEnergeticiRicercaComponent,
    data: { role: ['ADMIN', 'GEST', 'GUEST'] },
    canActivate: [AuthGuard],
  },
  {
    path: 'inserimento-dati',
    component: FormInizializzazioneComponent,
    data: { role: ['ADMIN', 'GEST'] },
    canActivate: [AuthGuard],
  },
  {
    path: 'modifica-dati/:id',
    component: FormModificaComponent,
    data: { role: ['ADMIN', 'GEST'] },
    canActivate: [AuthGuard],
  },
  {
    path: 'dettaglio-dati/:id',
    component: VisualizzaComponent,
    data: { role: ['ADMIN', 'GEST'] },
    canActivate: [AuthGuard],
  },
];
