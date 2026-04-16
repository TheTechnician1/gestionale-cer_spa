import { Routes } from "@angular/router";
import { FullLayoutComponent } from "./core/layout/full-layout.component";
import { AuthGuard } from "./core/guard/auth.guard";
import { RegistrazioneUtenteComponent } from "./core/component/login/registrazione-utente/registrazione-utente.component";
import { LoginComponent } from "./core/component/login/login/login.component";
import { CERComponent } from "./core/component/cer/cer.component";
import { DettaglioCerComponent } from "./core/component/dettaglio-cer/dettaglio-cer.component";
import { ConfigurazioneComponent } from "./core/component/configurazione/configurazione.component";
import { ModificaCerComponent } from "./core/component/modifica-cer/modifica-cer.component";
import { DashboardComponent } from "./core/component/dashboard/dashboard.component";
import { ProfiloUtenteComponent } from "./core/component/profilo-utente/profilo-utente.component";
import { InserimentoCerComponent } from "./core/component/inserimento-cer/inserimento-cer.component";
import { HomeComponent } from "./core/component/home/home.component";

export const FULL_LAYOUT_ROUTES: Routes = [
  { path: "", redirectTo: "home", pathMatch: "full" },
  { path: "home", component: HomeComponent, data: { role: ["ADMIN", "GEST", "GUEST"] }, canActivate: [AuthGuard], pathMatch: 'full' },
  { path: "dashboard", component: DashboardComponent, canActivate: [AuthGuard] },
  { path: "registrazione", component: RegistrazioneUtenteComponent, data: { role: ["ADMIN"] }, canActivate: [AuthGuard]},
  { path: "cer", component: CERComponent, canActivate: [AuthGuard],
    children: [
      { path: "inserimento-cer", component: InserimentoCerComponent, data: { role: ["ADMIN"] }, canActivate: [AuthGuard] },
      { path: "dettaglio-cer", component: DettaglioCerComponent, data: { role: ["ADMIN", "GEST", "GUEST"] }, canActivate: [AuthGuard] },
      { path: "modifica-cer", component: ModificaCerComponent, data: { role: ["ADMIN"] }, canActivate: [AuthGuard] }
    ]
  },
  { path: "configurazioni", component: ConfigurazioneComponent, data: { role: ["ADMIN", "GEST", "GUEST"] }, canActivate: [AuthGuard] },
  { path: "profilo-utente", component: ProfiloUtenteComponent, data: { role: ["ADMIN", "GEST"] }, canActivate: [AuthGuard] },
  { path: "login", component: LoginComponent },
  { path: "**",redirectTo: "login" },

];

export const routes: Routes = [
  { path: "", component: FullLayoutComponent, data: { title: "content Views" }, children: FULL_LAYOUT_ROUTES },
];
