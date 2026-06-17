import { Routes } from "@angular/router";
import { FullLayoutComponent } from "./core/layout/full-layout.component";
import { AuthGuard } from "./core/guard/auth.guard";
import { RegistrazioneUtenteComponent } from "./core/components/login/registrazione-utente/registrazione-utente.component";
import { LoginComponent } from "./core/components/login/login/login.component";
import { DashboardComponent } from "./components/dashboard/dashboard.component";
import { UtenteComponent } from "./core/components/utente/utente.component";
import { NotAuthorizedComponent } from "./core/components/not-authorized/not-authorized.component";
import { ProdottiComponent } from "./core/components/prodotti/prodotti.component";
import { ProdottoDettaglioComponent } from "./core/components/prodotto-dettaglio/prodotto-dettaglio.component";
import { CarrelloComponent } from "./core/components/carrello/carrello.component";
import { OrdineComponent } from "./core/components/ordine/ordine.component";

export const FULL_LAYOUT_ROUTES: Routes = [
  { path: "", redirectTo: "login", pathMatch: "full" },
  { path: "registration", component: RegistrazioneUtenteComponent},
  { path: "prodotti", component: ProdottiComponent, canActivate: [AuthGuard] },
  { path: "prodotto/:id", component: ProdottoDettaglioComponent, canActivate: [AuthGuard] },
  { path: "ricerca-prodotti/:ricerca", component: ProdottiComponent, canActivate: [AuthGuard] },
  { path: "carrello/:id", component: CarrelloComponent, canActivate: [AuthGuard] },
  { path: "ordine/:id", component: OrdineComponent, canActivate: [AuthGuard] },
  { path: "profilo/:id", component: UtenteComponent, canActivate: [AuthGuard] },
  { path: "login", component: LoginComponent },
  { path: "not-authorized", component: NotAuthorizedComponent },
  { path: "**", redirectTo: "not-authorized" },
];

export const routes: Routes = [{ path: "", component: FullLayoutComponent, data: { title: "content Views" }, children: FULL_LAYOUT_ROUTES }];
