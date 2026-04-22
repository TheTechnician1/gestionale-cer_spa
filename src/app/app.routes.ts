import { Routes } from '@angular/router';
import { FullLayoutComponent } from './core/layout/full-layout.component';
import { AuthGuard } from './core/guard/auth.guard';
import { LoginComponent } from './login/login.component';
import { RegistrazioneUtenteComponent } from './registrazione-utente/registrazione-utente.component';
import { TabellaCERComponent } from './tabella-cer/tabella-cer.component';
import { FormRicercaCerComponent } from './form-ricerca-cer/form-ricerca-cer.component';
import { Role } from './core/util/role.enum';
import { HomeComponent } from './home/home.component';
import { TabellaUtentiComponent } from './tabella-utenti/tabella-utenti.component';

export const FULL_LAYOUT_ROUTES: Routes = [
  //{ path: "pagina2", component: LoginComponent },
  { path: "", redirectTo: "home", pathMatch: "full" },
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
    path: 'home',
    component: HomeComponent,
    canActivate: [AuthGuard],
    data: {
      roles: [Role.ADMIN, Role.GEST, Role.GUEST],
    },
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
];
