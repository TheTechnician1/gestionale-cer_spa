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
import { SearchComponent } from "./core/components/search/search.component";
import { OrderComponent } from "./core/components/order/order.component";
import { ModificaUtenteComponent } from "./core/components/modifica-utente/modifica-utente.component";
import { OrderDetailComponent } from "./core/components/order-detail/order-detail.component";
import { CheckoutComponent } from "./core/components/checkout/checkout.component";
import { PaypageComponent } from "./core/components/paypage/paypage.component";
import { ConfirmOrderComponent } from "./core/components/confirm-order/confirm-order.component";
import { OrderCompletedComponent } from "./core/components/order-completed/order-completed.component";
import { ResetPasswordComponent } from "./core/components/reset-password/reset-password.component";

export const FULL_LAYOUT_ROUTES: Routes = [
  { path: "", component: DashboardComponent, pathMatch: "full" },
  { path: "registrazione", component: RegistrazioneUtenteComponent },
  { path: "profilo/:id", component: UtenteComponent },
  { path: "modifica-profilo/:id", component: ModificaUtenteComponent },
  { path: "login", component: LoginComponent },
  { path: "prodotto/:id", component: ProductComponent },
  { path: "carrello/:id", component: CartComponent },
  { path: "offerte", component: OfferteComponent },
  { path: "ricerca-avanzata", component: SearchComponent },
  { path: "ordini", component: OrderComponent },
  { path: "ordini/:id", component: OrderDetailComponent },
  { path: "checkout", component: CheckoutComponent },
  { path: "payment", component: PaypageComponent },
  { path: "conferma-ordine", component: ConfirmOrderComponent },
  { path: "ricevuta-ordine", component: OrderCompletedComponent },
  { path: "reset-password", component: ResetPasswordComponent },
  { path: "not-authorized", component: NotAuthorizedComponent },
  { path: "**", redirectTo: "not-authorized" },
];

export const routes: Routes = [{ path: "", component: FullLayoutComponent, data: { title: "content Views" }, children: FULL_LAYOUT_ROUTES }];
