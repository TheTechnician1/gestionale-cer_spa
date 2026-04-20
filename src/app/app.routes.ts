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
import { InserimentoCerComponent } from "./core/component/inserimento-cer/inserimento-cer.component";
import { HomeComponent } from "./core/component/home/home.component";
import { ImpiantoComponent } from "./core/component/impianto/impianto.component";
import { InserimentoImpiantoComponent } from "./core/component/inserimento-impianto/inserimento-impianto.component";
import { DatiEnergeticiComponent } from "./core/component/dati-energetici/dati-energetici.component";
import { InserimentoDatiEnergeticiComponent } from "./core/component/inserimento-dati-energetici/inserimento-dati-energetici.component";
import { InserimentoConfigurazioneComponent } from "./core/component/inserimento-configurazione/inserimento-configurazione.component";
import { UtenteComponent } from "./core/component/utente/utente.component";
import { ModificaImpiantoComponent } from "./core/component/modifica-impianto/modifica-impianto.component";
import { DettaglioImpiantoComponent } from "./core/component/dettaglio-impianto/dettaglio-impianto.component";
import { DettaglioConfigurazioneComponent } from "./core/component/dettaglio-configurazione/dettaglio-configurazione.component";
import { ModificaConfigurazioneComponent } from "./core/component/modifica-configurazione/modifica-configurazione.component";
import { ModificaDatiEnergeticiComponent } from "./core/component/modifica-dati-energetici/modifica-dati-energetici.component";
import { DettaglioDatiEnergeticiComponent } from "./core/component/dettaglio-dati-energetici/dettaglio-dati-energetici.component";
import { NotAuthorizedComponent } from "./core/component/not-authorized/not-authorized.component";

export const FULL_LAYOUT_ROUTES: Routes = [
  { path: "", redirectTo: "home", data: { role: ["ADMIN", "GEST", "GUEST"] }, pathMatch: "full" },
  { path: "home", component: HomeComponent, data: { role: ["ADMIN", "GEST", "GUEST"] }, canActivate: [AuthGuard], pathMatch: 'full' },
  { path: "dashboard", component: DashboardComponent, data: { role: ["ADMIN", "GEST", "GUEST"] }, canActivate: [AuthGuard] },
  { path: "registrazione", component: RegistrazioneUtenteComponent, data: { role: ["ADMIN"] }, canActivate: [AuthGuard]},
  { path: "cer", component: CERComponent, data: { role: ["ADMIN", "GEST", "GUEST"] }, canActivate: [AuthGuard],
    children: [
      { path: "inserimento-cer", component: InserimentoCerComponent, data: { role: ["ADMIN"] }, canActivate: [AuthGuard] },
      { path: "dettaglio-cer/:id", component: DettaglioCerComponent, data: { role: ["ADMIN", "GEST", "GUEST"] }, canActivate: [AuthGuard] },
      { path: "modifica-cer/:id", component: ModificaCerComponent, data: { role: ["ADMIN"] }, canActivate: [AuthGuard] }
    ]
  },
  { path: "configurazione", component: ConfigurazioneComponent, data: { role: ["ADMIN", "GEST", "GUEST"] }, canActivate: [AuthGuard],
    children: [
      { path: "inserimento-configurazione", component: InserimentoConfigurazioneComponent, data: { role: ["ADMIN", "GEST"] }, canActivate: [AuthGuard] },
      { path: "modifica-configurazione/:id", component: ModificaConfigurazioneComponent, data: { role: ["ADMIN", "GEST"] }, canActivate: [AuthGuard] },
      { path: "dettaglio-configurazione/:id", component: DettaglioConfigurazioneComponent, data: { role: ["ADMIN", "GEST"] }, canActivate: [AuthGuard] }
    ]
  },
  { path: "impianto", component: ImpiantoComponent, data: { role: ["ADMIN", "GEST", "GUEST"] }, canActivate: [AuthGuard],
    children: [
      { path: "inserimento-impianto", component: InserimentoImpiantoComponent, data: { role: ["ADMIN", "GEST"] }, canActivate: [AuthGuard] },
      { path: "modifica-impianto/:id", component: ModificaImpiantoComponent, data: { role: ["ADMIN", "GEST"] }, canActivate: [AuthGuard] },
      { path: "dettaglio-impianto/:id", component: DettaglioImpiantoComponent, data: { role: ["ADMIN", "GEST"] }, canActivate: [AuthGuard] }
    ]
  },
  { path: "dati-energetici", component: DatiEnergeticiComponent, data: { role: ["ADMIN", "GEST", "GUEST"] }, canActivate: [AuthGuard],
    children: [
      { path: "inserimento-dati-energetici", component: InserimentoDatiEnergeticiComponent, data: { role: ["ADMIN", "GEST"] }, canActivate: [AuthGuard] },
      { path: "modifica-dati-energetici", component: ModificaDatiEnergeticiComponent, data: { role: ["ADMIN", "GEST"] }, canActivate: [AuthGuard] },
      { path: "dettaglio-dati-energetici", component: DettaglioDatiEnergeticiComponent, data: { role: ["ADMIN", "GEST"] }, canActivate: [AuthGuard] }
    ]
  },
  { path: "profilo/:id", component: UtenteComponent, data: { role: ["ADMIN", "GEST"] }, canActivate: [AuthGuard] },
  { path: "login", component: LoginComponent },
  { path: "**",redirectTo: "login" },
  { path: '**', component: NotAuthorizedComponent }

];

export const routes: Routes = [
  { path: "", component: FullLayoutComponent, data: { title: "content Views" }, children: FULL_LAYOUT_ROUTES },
];
