import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { LoginComponent } from "./core/components//login/login/login.component";
import { RegistrazioneComponent } from "./core/components/login/registrazione/registrazione.component";
import { ListaProdottiComponent } from "./core/components/lista-prodotti/lista-prodotti.component";
import { DettaglioProdottiComponent } from "./core/components/dettaglio-prodotti/dettaglio-prodotti.component";
import { CartComponent } from "./core/components/cart/cart.component";
import { FullLayoutComponent } from "./core/layout/full-layout.component";

const routes = [
  { path: "", component: FullLayoutComponent, children: [
      { path: 'register', component: RegistrazioneComponent },
      { path: 'products', component: ListaProdottiComponent },
      { path: 'products/:id', component: DettaglioProdottiComponent },
      { path: 'cart', component: CartComponent },
    ]
  },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegistrazioneComponent},
  { path: '**', redirectTo: 'products'}
]; 

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
