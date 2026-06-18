import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { RegistrazioneComponent } from './pages/registrazione/registrazione.component';
import { HomeComponent } from './pages/home/home.component';
import { ProdottiComponent } from './pages/prodotti/prodotti.component';
import { CarrelloComponent } from './pages/carrello/carrello.component';
import { ProfiloComponent } from './pages/profilo/profilo.component';
import { FondiComponent } from './pages/fondi/fondi.component';
import { AuthGuard } from './guards/auth.guard';
import { PagamentoCompletatoComponent } from './pages/pagamento-completato/pagamento-completato.component';
import { DettaglioProdottoComponent } from './pages/dettaglio-prodotto/dettaglio-prodotto.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'registrazione',
    component: RegistrazioneComponent,
  },
  {
    path: 'home',
    component: HomeComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'prodotti/dettaglio/:idProdotto',
    component: DettaglioProdottoComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'prodotti/categoria/:nomeCategoria',
    component: ProdottiComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'prodotti',
    component: ProdottiComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'carrello',
    component: CarrelloComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'pagamento-completato',
    component: PagamentoCompletatoComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'profilo',
    component: ProfiloComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'fondi',
    component: FondiComponent,
    canActivate: [AuthGuard],
  },
  {
    path: '**',
    redirectTo: 'home',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
      anchorScrolling: 'enabled',
      scrollPositionRestoration: 'top',
    })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
