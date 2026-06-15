import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
  categorie = [
    { nome: 'Elettronica', immagine: 'elettronica.png' },
    { nome: 'Informatica', immagine: 'informatica.png' },
    { nome: 'Telefonia', immagine: 'telefono.png' },
    { nome: 'Casa e cucina', immagine: 'Casa e cucina.png' },
    { nome: 'Abbigliamento', immagine: 'abbigliamento.png' },
    { nome: 'Calzature', immagine: 'Calzature.png' },
    { nome: 'Sport e fitness', immagine: 'Sport e fitness.png' },
    {
      nome: 'Beauty care',
      immagine: 'Beauty care.png',
    },
    { nome: 'Giocattoli', immagine: 'Giocattoli.png' },
    { nome: 'Alimentari', immagine: 'alimentari.png' },
  ];
}
