import { Injectable } from '@angular/core';
export interface Login {
  ruolo: string;
  isLoginOK?: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  constructor() {}

  l: Login = {
    ruolo: 'ruolo non trovato',
    isLoginOK: false,
  };

  login(email: string, password: string): void {
    console.log('email = ', email);

    //qua dovrebbe poi chiamare endpoint. Ma per ora non lo fa... facciamo un controllo a secco

    let utente = [
      {
        email: 'peppe@gmail.com',
        password: 'Peppe',
        ruolo: 'ADMIN',
      },
      {
        email: 'danielefatso@gmail.com',
        password: 'Dani345',
        ruolo: 'GEST',
      },
      {
        email: 'franco978@gmail.com',
        password: 'FrancoTiGuarda',
        ruolo: 'GUEST',
      },
      {
        email: 'heisenberg@gmail.com',
        password: 'cucinare',
        ruolo: 'GUEST',
      },
      {
        email: 'lucio.dalla@gmail.com',
        password: '4ttent1.4l.lup0',
        ruolo: 'GEST',
      },
      {
        email: 'rene.ferretti@gmail.com',
        password: 'Fiano.Romano',
        ruolo: 'ADMIN',
      },
      {
        email: 'guest@guest.guest',
        password: 'guest',
        ruolo: 'GUEST',
      },
    ];

    for (let u of utente) {
      if (u.email === email && u.password === password) {
        this.l.ruolo = u.ruolo;
        this.l.isLoginOK = true;
        break;
      } else {
        this.l.ruolo = 'ruolo non trovato';
        this.l.isLoginOK = false;
      }
    }
  }

  getL(): Login {
    return this.l;
  }
}
