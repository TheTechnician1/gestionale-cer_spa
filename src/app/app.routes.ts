import { Routes } from "@angular/router";
import { GeneralComponent } from "./core/layout/general.component";
import { AuthGuard } from "./core/guard/auth.guard";
import { RegistrazioneUtenteComponent } from "./core/components/login/registrazione-utente/registrazione-utente.component";
import { LoginComponent } from "./core/components/login/login/login.component";
import { DashboardComponent } from "./components/dashboard/dashboard.component";
import { UtenteComponent } from "./core/components/utente/utente.component";
import { NotAuthorizedComponent } from "./core/components/not-authorized/not-authorized.component";

export const GENERAL_ROUTES: Routes = [
  { path: "", redirectTo: "login", pathMatch: "full" },
  { path: "login", component: LoginComponent },
  { path: "dashboard", component: DashboardComponent, canActivate: [AuthGuard] },
  { path: "register", component: RegistrazioneUtenteComponent},
  { path: "profilo/:id", component: UtenteComponent, canActivate: [AuthGuard] },
  { path: "not-authorized", component: NotAuthorizedComponent },
  { path: "**", redirectTo: "not-authorized" },
];

export const routes: Routes = [{ path: "", component: GeneralComponent, data: { title: "content Views" }, children: GENERAL_ROUTES }];





































  // { path: "impianto", loadChildren: () => import("./core/modules/impianto.module").then((m) => m.ImpiantoModule), data: { role: ["ADMIN", "GEST", "GUEST"] }, canActivate: [AuthGuard] },
  // { path: "dati-energetici", loadChildren: () => import("./core/modules/dati-energetici.module").then((m) => m.DatiEnergeticiModule), data: { role: ["ADMIN", "GEST", "GUEST"] }, canActivate: [AuthGuard] },