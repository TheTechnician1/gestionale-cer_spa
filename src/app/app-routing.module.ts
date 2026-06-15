import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { RegistrazioneComponent } from './pages/registrazione/registrazione.component';
import { HomeComponent } from './pages/home/home.component';
import { ProdottiComponent } from './pages/prodotti/prodotti.component';
import { CarrelloComponent } from './pages/carrello/carrello.component';

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
  },
  {
    path: 'prodotti/categoria/:nomeCategoria',
    component: ProdottiComponent,
  },
  {
    path: 'prodotti',
    component: ProdottiComponent,
  },
  {
    path: 'carrello',
    component: CarrelloComponent,
  },
  {
    path: '**',
    redirectTo: 'home',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
