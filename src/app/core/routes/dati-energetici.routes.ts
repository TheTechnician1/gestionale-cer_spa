import { Routes } from "@angular/router";
import { AuthGuard } from "../guard/auth.guard";
import { DatiEnergeticiRicercaComponent } from "src/app/components/dati-energetici/dati-energetici-ricerca/dati-energetici-ricerca.component";
import { DatiEnergeticiFormComponent } from "src/app/components/dati-energetici/dati-energetici-form/dati-energetici-form.component";

export const DATI_ENERGETICI_ROUTES: Routes = [
  {
    path: "",
    component: DatiEnergeticiRicercaComponent,
    data: { role: ["ADMIN", "GEST", "GUEST"] },
    canActivate: [AuthGuard],
  },
  {
    path: "inserimento-dati",
    component: DatiEnergeticiFormComponent,
    data: { role: ["ADMIN", "GEST"] },
    canActivate: [AuthGuard],
  },
  {
    path: "modifica-dati/:id",
    component: DatiEnergeticiFormComponent,
    data: { role: ["ADMIN", "GEST"] },
    canActivate: [AuthGuard],
  },
  {
    path: "dettaglio-dati/:id",
    component: DatiEnergeticiFormComponent,
    data: { role: ["ADMIN", "GEST", "GUEST"] },
    canActivate: [AuthGuard],
  },
];
