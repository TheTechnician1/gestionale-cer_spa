import { Routes } from "@angular/router";
import { AuthGuard } from "../guard/auth.guard";
import { ImpiantiFormComponent } from "../../components/impianti/impianti-form/impianti-form.component";
import { ImpiantiRicercaComponent } from "../../components/impianti/impianti-ricerca/impianti-ricerca.component";

export const IMPIANTO_ROUTES: Routes = [
  {
    path: "",
    component: ImpiantiRicercaComponent,
    data: { role: ["ADMIN", "GEST", "GUEST"] },
    canActivate: [AuthGuard],
  },
  {
    path: "inserimento-impianto",
    component: ImpiantiFormComponent,
    data: { role: ["ADMIN", "GEST"] },
    canActivate: [AuthGuard],
  },
  {
    path: "modifica-impianto/:id",
    component: ImpiantiFormComponent,
    data: { role: ["ADMIN", "GEST"] },
    canActivate: [AuthGuard],
  },
  {
    path: "dettaglio-impianto/:id",
    component: ImpiantiFormComponent,
    data: { role: ["ADMIN", "GEST", "GUEST"] },
    canActivate: [AuthGuard],
  },
];
