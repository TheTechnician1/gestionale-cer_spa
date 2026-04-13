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

export const FULL_LAYOUT_ROUTES: Routes = [
  { path: "", component: UtenteComponent, pathMatch: 'full' },
  { path: "dashboard", component: DashboardComponent },
  { path: "registrazione", component: RegistrazioneUtenteComponent },
  { path: "login", component: LoginComponent },
  { path: "cer", component: CERComponent,
    children: [
      { path: "dettaglio-cer", component: DettaglioCerComponent },
      { path: "modifica-cer", component: ModificaCerComponent }
    ]
  },
  { path: "configurazioni", component: ConfigurazioneComponent }
];

export const routes: Routes = [{ path: "", component: FullLayoutComponent, data: { title: "content Views" }, children: FULL_LAYOUT_ROUTES /* canActivate: [AuthGuard] */ }];
