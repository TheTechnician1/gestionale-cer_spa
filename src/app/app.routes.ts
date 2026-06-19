import { Routes } from '@angular/router';
import { FullLayoutComponent } from './core/layout/full-layout.component';
import { AuthGuard } from './core/guard/auth.guard';
import { LoggedInGuard } from './core/guard/logged-in.guard';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { ProdottiComponent } from './components/prodotti/prodotti.component';
import { ProdottiDettaglioComponent } from './components/prodotti-dettaglio/prodotti-dettaglio.component';
import { CarrelloComponent } from './components/carrello/carrello.component';
import { CheckoutComponent } from './components/checkout/checkout.component';
import { ProfiloComponent } from './components/profilo/profilo.component';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent, canActivate: [LoggedInGuard] },
  { path: 'register', component: RegisterComponent, canActivate: [LoggedInGuard] },
  {
    path: '',
    component: FullLayoutComponent,
    canActivate: [AuthGuard],
    children: [
      { path: 'prodotti', component: ProdottiComponent },
      { path: 'prodotti/:id', component: ProdottiDettaglioComponent },
      { path: 'carrello', component: CarrelloComponent },
      { path: 'checkout', component: CheckoutComponent },
      { path: 'profilo', component: ProfiloComponent }
    ],
  }
];