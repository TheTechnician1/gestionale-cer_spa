import { Routes } from "@angular/router";
import { AuthGuard } from "../guard/auth.guard";
import { ImpiantoComponent } from "../component/impianto/impianto.component";
import { DettaglioImpiantoComponent } from "../component/dettaglio-impianto/dettaglio-impianto.component";
import { InserimentoImpiantoComponent } from "../component/inserimento-impianto/inserimento-impianto.component";
import { ModificaImpiantoComponent } from "../component/modifica-impianto/modifica-impianto.component";

export const IMPIANTO_ROUTES: Routes = [
  {
    path: "",
    component: ImpiantoComponent,
    data: { role: ["ADMIN", "GEST", "GUEST"] },
    canActivate: [AuthGuard],
  },
  {
    path: "inserimento-impianto",
    component: InserimentoImpiantoComponent,
    data: { role: ["ADMIN", "GEST"] },
    canActivate: [AuthGuard],
  },
  {
    path: "modifica-impianto/:id",
    component: ModificaImpiantoComponent,
    data: { role: ["ADMIN", "GEST"] },
    canActivate: [AuthGuard],
  },
  {
    path: "dettaglio-impianto/:id",
    component: DettaglioImpiantoComponent,
    data: { role: ["ADMIN", "GEST"] },
    canActivate: [AuthGuard],
  },
];
