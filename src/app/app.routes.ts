import { Routes } from '@angular/router';
import { FullLayoutComponent } from './core/layout/full-layout.component';
import { AuthGuard } from './core/guard/auth.guard';
import { LoginComponent } from './login/login.component';
import { RegistrazioneUtenteComponent } from './registrazione-utente/registrazione-utente.component';
import { Role } from './core/services/auth.service';
import { FormRicercaCerComponent } from "./form-ricerca-cer/form-ricerca-cer.component";

import { TabellaCERComponent } from './tabella-cer/tabella-cer.component';
import { DettagliTabellaCerComponent } from './dettagli-tabella-cer/dettagli-tabella-cer.component';

export const FULL_LAYOUT_ROUTES: Routes = [
  //{ path: "pagina2", component: LoginComponent },

  {
    path: 'user/new',
    component: RegistrazioneUtenteComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'tabella-cer',
    component: FormRicercaCerComponent,
    canActivate: [AuthGuard],
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
  },
];

export const routes: Routes = [
  // { path: "r", component: FullLayoutComponent, data: { title: "content Views" }, children: FULL_LAYOUT_ROUTES /* canActivate: [AuthGuard] */ },

  //{ path: '', redirectTo: 'login', pathMatch: 'full' },
  {
    path: '',
    component: FullLayoutComponent,
    data: {
      title: 'content Views',
      roles: [Role.ADMIN, Role.GEST, Role.GUEST],
    },
    canActivate: [AuthGuard],
    children: FULL_LAYOUT_ROUTES,
  },
  { path: "user/new", component: RegistrazioneUtenteComponent },
  { path: 'login', component: LoginComponent},

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
