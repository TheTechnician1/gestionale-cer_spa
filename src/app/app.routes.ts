import { Routes } from '@angular/router';
import { FullLayoutComponent } from './core/layout/full-layout.component';
import { AuthGuard } from './core/guard/auth.guard';
import { LoginComponent } from './login/login.component';
import { RegistrazioneUtenteComponent } from './registrazione-utente/registrazione-utente.component';
import { TabellaCERComponent } from './tabella-cer/tabella-cer.component';
import { DettagliTabellaCerComponent } from './dettagli-tabella-cer/dettagli-tabella-cer.component';
import { RegistrazioneCerComponent } from './registrazione-cer/registrazione-cer.component';
import { FormRicercaCerComponent } from './form-ricerca-cer/form-ricerca-cer.component';
import { Role } from './core/util/role.enum';
import { HomeComponent } from './home/home.component';
import { TabellaUtentiComponent } from './tabella-utenti/tabella-utenti.component';
import { CerDisattivateComponent } from './cer-disattivate/cer-disattivate.component';
import { RicercaImpiantiComponent } from './ricerca-impianti/ricerca-impianti.component';
import { FormImpiantoComponent } from './form-impianto/form-impianto.component';
import { RicercaConfigurazioniComponent } from './ricerca-configurazioni/ricerca-configurazioni.component';
import { FormConfigurazioneComponent } from './form-configurazione/form-configurazione.component';
import { ImpostazioniComponent } from './impostazioni/impostazioni.component';
import { RicercaDatiEnergeticiComponent } from './ricerca-dati-energetici/ricerca-dati-energetici.component';
import { FormDatiEnergeticiComponent } from './form-dati-energetici/form-dati-energetici.component';

export const FULL_LAYOUT_ROUTES: Routes = [
  //{ path: "pagina2", component: LoginComponent },
  { path: "", redirectTo: "home", pathMatch: "full" },
  {
    path: 'home',
    component: HomeComponent,
    canActivate: [AuthGuard],
  },
  { path: 'user',
    component: TabellaUtentiComponent,
    canActivate: [AuthGuard],
    data: {
      roles: [Role.ADMIN],
    },
  },
  {
    path: 'user/new',
    component: RegistrazioneUtenteComponent,
    canActivate: [AuthGuard],
    data: {
      roles: [Role.ADMIN],
    },
  },
  {
    path: 'tabella-cer',
    component: FormRicercaCerComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'cer/new',
    component: RegistrazioneCerComponent,
    canActivate: [AuthGuard],
    data: {
      roles: [Role.ADMIN],
    },
  },
  {
    path: 'cer/disattivate',
    component: CerDisattivateComponent,
    canActivate: [AuthGuard],
    data: {
      roles: [Role.ADMIN],
    },
  },
  {
    path: 'cer/disattivate/:id',
    component: DettagliTabellaCerComponent,
    canActivate: [AuthGuard],
    data: {
      roles: [Role.ADMIN],
    },
  },
  {
    path: 'configurazioni',
    component: RicercaConfigurazioniComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'configurazioni/new',
    component: FormConfigurazioneComponent,
    canActivate: [AuthGuard],
    data: {
      roles: [Role.ADMIN],
    },
  },
  {
    path: 'configurazioni/:id/edit',
    component: FormConfigurazioneComponent,
    canActivate: [AuthGuard],
    data: {
      roles: [Role.ADMIN, Role.GEST],
    },
  },
  {
    path: 'impianti',
    component: RicercaImpiantiComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'impianti/new',
    component: FormImpiantoComponent,
    canActivate: [AuthGuard],
    data: {
      roles: [Role.ADMIN],
    },
  },
  {
    path: 'impianti/:id/edit',
    component: FormImpiantoComponent,
    canActivate: [AuthGuard],
    data: {
      roles: [Role.ADMIN, Role.GEST],
    },
  },
  {
    path: 'dati-energetici',
    component: RicercaDatiEnergeticiComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'dati-energetici/new',
    component: FormDatiEnergeticiComponent,
    canActivate: [AuthGuard],
    data: {
      roles: [Role.ADMIN],
    },
  },
  {
    path: 'dati-energetici/:id/edit',
    component: FormDatiEnergeticiComponent,
    canActivate: [AuthGuard],
    data: {
      roles: [Role.ADMIN, Role.GEST],
    },
  },
  {
    path: 'tabella-cer/:id/impianti/:impiantoId',
    component: DettagliTabellaCerComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'tabella-cer/:id',
    component: DettagliTabellaCerComponent,
    canActivate: [AuthGuard],
    data: {
      roles: [Role.ADMIN, Role.GEST, Role.GUEST],
    },
  },
  {
    path: 'impostazioni',
    component: ImpostazioniComponent,
    canActivate: [AuthGuard],
  },
  { path: "**", redirectTo: "home" },
  
];

export const routes: Routes = [
    { path: 'login', component: LoginComponent, data: { public: true } },

  {
    path: '',
    component: FullLayoutComponent,
    canActivateChild: [AuthGuard], 
    children: FULL_LAYOUT_ROUTES,
  },

//   {
//   path: 'admin',
//   component: AdminComponent,
//   canActivate: [AuthGuard],
//   data: { roles: [Role.ADMIN] }
// },
// {
//   path: 'gestore',
//   component: GestoreComponent,
//   canActivate: [AuthGuard],
//   data: { roles: [Role.ADMIN, Role.GEST] }
// },

  //   {
  //   path: 'admin',
  //   component: AdminComponent,
  //   canActivate: [AuthGuard],
  //   data: { roles: [Role.ADMIN] }
  // },
  // {
  //   path: 'gestore',
  //   component: GestoreComponent,
  //   canActivate: [AuthGuard],
  //   data: { roles: [Role.ADMIN, Role.GEST] }
  // },
];
