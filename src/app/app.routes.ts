import { Routes } from "@angular/router";
import { FullLayoutComponent } from "./core/layout/full-layout.component";
import { AuthGuard } from "./core/guard/auth.guard";
import { LoginComponent } from "./login/login.component";
import { RegistrazioneUtenteComponent } from "./registrazione-utente/registrazione-utente.component";

export const FULL_LAYOUT_ROUTES: Routes = [
  /* { path: "pagina1", component: Component1 }, */
];

export const routes: Routes = [
  { path: "login", component: LoginComponent },
  { path: "", component: RegistrazioneUtenteComponent },
  { path: "r", component: FullLayoutComponent, data: { title: "content Views" }, children: FULL_LAYOUT_ROUTES /* canActivate: [AuthGuard] */ },
  
];
