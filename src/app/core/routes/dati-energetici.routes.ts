import { Routes } from "@angular/router";
import { AuthGuard } from "../guard/auth.guard";
import { DatiEnergeticiComponent } from "../component/dati-energetici/dati-energetici.component";
import { DettaglioDatiEnergeticiComponent } from "../component/dettaglio-dati-energetici/dettaglio-dati-energetici.component";
import { InserimentoDatiEnergeticiComponent } from "../component/inserimento-dati-energetici/inserimento-dati-energetici.component";
import { ModificaDatiEnergeticiComponent } from "../component/modifica-dati-energetici/modifica-dati-energetici.component";

export const DATI_ENERGETICI_ROUTES: Routes = [
  {
    path: "",
    component: DatiEnergeticiComponent,
    data: { role: ["ADMIN", "GEST", "GUEST"] },
    canActivate: [AuthGuard],
  },
  {
    path: "inserimento-dati",
    component: InserimentoDatiEnergeticiComponent,
    data: { role: ["ADMIN", "GEST"] },
    canActivate: [AuthGuard],
  },
  {
    path: "modifica-dati/:id",
    component: ModificaDatiEnergeticiComponent,
    data: { role: ["ADMIN", "GEST"] },
    canActivate: [AuthGuard],
  },
  {
    path: "dettaglio-dati/:id",
    component: DettaglioDatiEnergeticiComponent,
    data: { role: ["ADMIN", "GEST"] },
    canActivate: [AuthGuard],
  },
];
