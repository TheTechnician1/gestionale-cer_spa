import { Routes } from "@angular/router";
import { FullLayoutComponent } from "./core/layout/full-layout.component";
import { AuthGuard } from "./core/guard/auth.guard";
import { RegistrazioneComponent } from "./components/auth/registrazione/registrazione.component";
import { LoginComponent } from "./components/auth/login/login.component";
import { CerGestioneComponent } from "./components/comunita-energetica/cer-gestione/cer-gestione.component";
import { CerInserimentoComponent } from "./components/comunita-energetica/cer-inserimento/cer-inserimento.component";
import { CerModificaComponent } from "./components/comunita-energetica/cer-modifica/cer-modifica.component";
import { ConfigGestioneComponent } from "./components/configurazione/config-gestione/config-gestione.component";
import { ConfigInserimentoComponent } from "./components/configurazione/config-inserimento/config-inserimento.component";
import { ConfigModificaComponent } from "./components/configurazione/config-modifica/config-modifica.component";
import { ImpiantoGestioneComponent } from "./components/impianto/impianto-gestione/impianto-gestione.component";
import { ImpiantoInserimentoComponent } from "./components/impianto/impianto-inserimento/impianto-inserimento.component";
import { ImpiantoModificaComponent } from "./components/impianto/impianto-modifica/impianto-modifica.component";
import { NotFoundComponent } from "./components/not-found/not-found.component";
import { DashboardComponent } from "./components/dashboard/dashboard.component";

export const FULL_LAYOUT_ROUTES: Routes = [
  { path: "", redirectTo: "dashboard", pathMatch: "full" },
  { path: "dashboard", component: DashboardComponent },
  { path: "registrazione", component: RegistrazioneComponent, canActivate: [AuthGuard], data: { roles: ["ADMIN"] } },
  { path: "cer", component: CerGestioneComponent },
  { path: "cer/nuova", component: CerInserimentoComponent, canActivate: [AuthGuard], data: { roles: ["ADMIN"] } },
  { path: "cer/dettaglio/:id", component: CerModificaComponent, data: { mode: "detail" } },
  { path: "cer/modifica/:id", component: CerModificaComponent, canActivate: [AuthGuard], data: { roles: ["ADMIN"] } },
  { path: "configurazioni", component: ConfigGestioneComponent },
  { path: "configurazioni/nuova", component: ConfigInserimentoComponent, canActivate: [AuthGuard], data: { roles: ["ADMIN", "GEST"] } },
  { path: "configurazioni/dettaglio/:id", component: ConfigModificaComponent, data: { mode: "detail" } },
  { path: "configurazioni/modifica/:id", component: ConfigModificaComponent, canActivate: [AuthGuard], data: { roles: ["ADMIN", "GEST"] } },
  { path: "impianti", component: ImpiantoGestioneComponent },
  { path: "impianti/nuovo", component: ImpiantoInserimentoComponent, canActivate: [AuthGuard], data: { roles: ["ADMIN", "GEST"] } },
  { path: "impianti/dettaglio/:id", component: ImpiantoModificaComponent, data: { mode: "detail" } },
  { path: "impianti/modifica/:id", component: ImpiantoModificaComponent, canActivate: [AuthGuard], data: { roles: ["ADMIN", "GEST"] } },
  { path: "not-found", component: NotFoundComponent },
  { path: "**", redirectTo: "not-found" },
];

export const routes: Routes = [
  { path: "login", component: LoginComponent, data: { public: true } },
  { path: "", component: FullLayoutComponent, data: { title: "content Views" }, canActivateChild: [AuthGuard], children: FULL_LAYOUT_ROUTES },
];
