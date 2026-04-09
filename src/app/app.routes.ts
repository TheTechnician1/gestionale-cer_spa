import { Routes } from "@angular/router";
import { FullLayoutComponent } from "./core/layout/full-layout.component";
import { AuthGuard } from "./core/guard/auth.guard";
import { RegistrazioneUtenteComponent } from "./core/component/login/registrazione-utente/registrazione-utente.component";
import { LoginComponent } from "./core/component/login/login/login.component";

export const FULL_LAYOUT_ROUTES: Routes = [
  { path: "registrazione", component: RegistrazioneUtenteComponent 
  },
  { path: "login", component: LoginComponent }
];

export const routes: Routes = [{ path: "", component: FullLayoutComponent, data: { title: "content Views" }, children: FULL_LAYOUT_ROUTES /* canActivate: [AuthGuard] */ }];
