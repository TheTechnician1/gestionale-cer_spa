import { Routes } from "@angular/router";
import { AuthGuard } from "../guard/auth.guard";
import { CERComponent } from "../component/cer/cer.component";
import { DettaglioCerComponent } from "../component/dettaglio-cer/dettaglio-cer.component";
import { InserimentoCerComponent } from "../component/inserimento-cer/inserimento-cer.component";
import { ModificaCerComponent } from "../component/modifica-cer/modifica-cer.component";

export const CER_ROUTES: Routes = [
  {
    path: "",
    component: CERComponent,
    data: { role: ["ADMIN", "GEST", "GUEST"] },
    canActivate: [AuthGuard],
  },
  {
    path: "inserimento-cer",
    component: InserimentoCerComponent,
    data: { role: ["ADMIN"] },
    canActivate: [AuthGuard],
  },
  {
    path: "dettaglio-cer/:id",
    component: DettaglioCerComponent,
    data: { role: ["ADMIN", "GEST", "GUEST"] },
    canActivate: [AuthGuard],
  },
  {
    path: "modifica-cer/:id",
    component: ModificaCerComponent,
    data: { role: ["ADMIN"] },
    canActivate: [AuthGuard],
  },
];
