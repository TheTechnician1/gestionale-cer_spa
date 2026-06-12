import { Routes } from "@angular/router";
import { FullLayoutComponent } from "./core/layout/full-layout.component";
import { RegistrazioneUtenteComponent } from "./core/components/login/registrazione-utente/registrazione-utente.component";
import { LoginComponent } from "./core/components/login/login/login.component";
import { UtenteComponent } from "./core/components/utente/utente.component";
import { NotAuthorizedComponent } from "./core/components/not-authorized/not-authorized.component";
import { DashboardComponent } from "./core/components/dashboard/dashboard.component";
import { CartComponent } from "./core/components/cart/cart.component";
import { ProductComponent } from "./core/components/product/product.component";
import { OfferteComponent } from "./core/components/offerte/offerte.component";

export const FULL_LAYOUT_ROUTES: Routes = [
  { path: "", component: DashboardComponent, pathMatch: "full" },
  { path: "registrazione", component: RegistrazioneUtenteComponent },
  { path: "profilo/:id", component: UtenteComponent },
  { path: "login", component: LoginComponent },
  { path: "prodotto/:id", component: ProductComponent },
  { path: "carrello/:id", component: CartComponent },
  { path: "offerte", component: OfferteComponent },
  { path: "not-authorized", component: NotAuthorizedComponent },
  { path: "**", redirectTo: "not-authorized" },
];

export const routes: Routes = [{ path: "", component: FullLayoutComponent, data: { title: "content Views" }, children: FULL_LAYOUT_ROUTES }];
