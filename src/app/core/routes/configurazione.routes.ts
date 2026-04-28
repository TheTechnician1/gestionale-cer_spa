import { Routes } from "@angular/router";
import { AuthGuard } from "../guard/auth.guard";
import { ConfigurazioneComponent } from "../component/configurazione/configurazione.component";
import { DettaglioConfigurazioneComponent } from "../component/dettaglio-configurazione/dettaglio-configurazione.component";
import { InserimentoConfigurazioneComponent } from "../component/inserimento-configurazione/inserimento-configurazione.component";
import { ModificaConfigurazioneComponent } from "../component/modifica-configurazione/modifica-configurazione.component";

export const CONFIGURAZIONE_ROUTES: Routes = [
  {
    path: "",
    component: ConfigurazioneComponent,
    data: { role: ["ADMIN", "GEST", "GUEST"] },
    canActivate: [AuthGuard],
  },
  {
    path: "inserimento-configurazione",
    component: InserimentoConfigurazioneComponent,
    data: { role: ["ADMIN", "GEST"] },
    canActivate: [AuthGuard],
  },
  {
    path: "modifica-configurazione/:id",
    component: ModificaConfigurazioneComponent,
    data: { role: ["ADMIN", "GEST"] },
    canActivate: [AuthGuard],
  },
  {
    path: "dettaglio-configurazione/:id",
    component: DettaglioConfigurazioneComponent,
    data: { role: ["ADMIN", "GEST", "GUEST"] },
    canActivate: [AuthGuard],
  },
];
