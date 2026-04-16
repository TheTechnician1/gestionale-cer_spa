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
import { UtenteComponent } from "./core/component/utente/utente.component";
import { ProfiloUtenteComponent } from "./core/component/profilo-utente/profilo-utente.component";
import { InserimentoCerComponent } from "./core/component/inserimento-cer/inserimento-cer.component";
import { ImpiantoComponent } from "./core/component/impianto/impianto.component";
import { InserimentoImpiantoComponent } from "./core/component/inserimento-impianto/inserimento-impianto.component";
import { DatiEnergeticiComponent } from "./core/component/dati-energetici/dati-energetici.component";

export const FULL_LAYOUT_ROUTES: Routes = [
  { path: "", component: UtenteComponent, pathMatch: 'full' },
  { path: "dashboard", component: DashboardComponent },
  { path: "registrazione", component: RegistrazioneUtenteComponent },
  { path: "login", component: LoginComponent },
  { path: "cer", component: CERComponent,
    children: [
      { path: "inserimento-cer", component: InserimentoCerComponent },
      { path: "dettaglio-cer", component: DettaglioCerComponent },
      { path: "modifica-cer", component: ModificaCerComponent }
    ]
  },
  { path: "configurazione", component: ConfigurazioneComponent },
  { path: "profilo-utente", component: ProfiloUtenteComponent },
  { path: "impianto", component: ImpiantoComponent,
    children: [
      { path: "inserimento-impianto", component: InserimentoImpiantoComponent }
    ]
   },
   { path: "dati-energetici", component: DatiEnergeticiComponent }
];

export const routes: Routes = [
  { path: "", component: FullLayoutComponent, data: { title: "content Views" }, children: FULL_LAYOUT_ROUTES /* canActivate: [AuthGuard] */ }
];
