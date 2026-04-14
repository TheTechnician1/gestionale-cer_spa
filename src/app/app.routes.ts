
import { Routes } from "@angular/router";
import { FullLayoutComponent } from "./core/layout/full-layout.component";
import { AuthGuard } from "./core/guard/auth.guard";
import { LoginComponent } from "./login/login.component";
import { RegistrazioneUtenteComponent } from "./registrazione-utente/registrazione-utente.component";
import { Role } from './core/services/auth.service';


export const FULL_LAYOUT_ROUTES: Routes = [
   { path: "pagina1", component: LoginComponent }, 
    { path: "pagina2", component: LoginComponent },
];

export const routes: Routes = [
  
  // { path: "r", component: FullLayoutComponent, data: { title: "content Views" }, children: FULL_LAYOUT_ROUTES /* canActivate: [AuthGuard] */ },
  
  // { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: '', component: FullLayoutComponent, data: { title: 'content Views', roles: [Role.ADMIN, Role.GEST, Role.GUEST] },
    children: FULL_LAYOUT_ROUTES, canActivate: [AuthGuard] ,
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

];
