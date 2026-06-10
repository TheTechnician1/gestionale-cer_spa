import { Routes } from "@angular/router";
import { FullLayoutComponent } from "./core/layout/full-layout.component";
import { AuthGuard } from "./core/guard/auth.guard";
import { RegistrazioneUtenteComponent } from "./core/components/login/registrazione-utente/registrazione-utente.component";
import { LoginComponent } from "./core/components/login/login/login.component";
import { DashboardComponent } from "./components/dashboard/dashboard.component";
import { UtenteComponent } from "./core/components/utente/utente.component";
import { NotAuthorizedComponent } from "./core/components/not-authorized/not-authorized.component";

export const FULL_LAYOUT_ROUTES: Routes = [
  { path: "", redirectTo: "dashboard", data: { role: ["ADMIN", "GEST", "GUEST"] }, pathMatch: "full" },
  { path: "dashboard", component: DashboardComponent, data: { role: ["ADMIN", "GEST", "GUEST"] }, canActivate: [AuthGuard] },
  { path: "registration", component: RegistrazioneUtenteComponent},
  { path: "impianto", loadChildren: () => import("./core/modules/impianto.module").then((m) => m.ImpiantoModule), data: { role: ["ADMIN", "GEST", "GUEST"] }, canActivate: [AuthGuard] },
  { path: "dati-energetici", loadChildren: () => import("./core/modules/dati-energetici.module").then((m) => m.DatiEnergeticiModule), data: { role: ["ADMIN", "GEST", "GUEST"] }, canActivate: [AuthGuard] },
  { path: "profilo/:id", component: UtenteComponent, data: { role: ["ADMIN", "GEST"] }, canActivate: [AuthGuard] },
  { path: "login", component: LoginComponent },
  { path: "not-authorized", component: NotAuthorizedComponent },
  { path: "**", redirectTo: "not-authorized" },
];

export const routes: Routes = [{ path: "", component: FullLayoutComponent, data: { title: "content Views" }, children: FULL_LAYOUT_ROUTES }];
