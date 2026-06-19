import { Routes } from "@angular/router";
import { FullLayoutComponent } from "./core/layout/full-layout.component";
import { AuthGuard } from "./core/guard/auth.guard";
import { RegistrazioneComponent } from "./core/components/login/registrazione/registrazione.component";
import { LoginComponent } from "./core/components/login/login/login.component";
import { ListaProdottiComponent } from "./core/components/lista-prodotti/lista-prodotti.component";
import { DettaglioProdottiComponent } from "./core/components/dettaglio-prodotti/dettaglio-prodotti.component";
import { CartComponent } from "./core/components/cart/cart.component";

export const FULL_LAYOUT_ROUTES: Routes = [
  { path: "", redirectTo: "products", pathMatch: "full" },
  { path: "login", component: LoginComponent },
  { path: "registrazione", component: RegistrazioneComponent },
  { path: "products", component: ListaProdottiComponent, canActivate: [AuthGuard] },
  { path: "products/:id", component: DettaglioProdottiComponent, canActivate: [AuthGuard] },
  { path: "cart", component: CartComponent, canActivate: [AuthGuard] },
  { path: "checkout", component: CartComponent, canActivate: [AuthGuard] },
  { path: "**", redirectTo: "products" },
];

export const routes: Routes = [{ path: "", component: FullLayoutComponent, data: { title: "content Views" }, children: FULL_LAYOUT_ROUTES }];
