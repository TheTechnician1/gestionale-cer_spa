import { Injectable } from '@angular/core';
import { StorageService } from './storage.service';
export interface Login {
  ruolo: string;
  isLoginOK?: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  private readonly ruolo = 'response_ruolo';

  constructor(private storage: StorageService) {}

  l: Login = {
    ruolo: 'ruolo non trovato',
    isLoginOK: false,
  };

  id = 0;

  login(email: string, password: string): void {
    console.log('email = ', email);

    //qua dovrebbe poi chiamare endpoint. Ma per ora non lo fa... facciamo un controllo a secco

    let utente = [
      {
        email: 'peppe@gmail.com',
        password: 'polpolpo',
        ruolo: 'ADMIN',
      },
      {
        email: 'danielefatso@gmail.com',
        password: 'Dani3459',
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
      {
        email: 'simone@gmail.com',
        password: 'simone77',
        ruolo: 'GUEST',
      },
    ];

    for (let u of utente) {
      if (u.email === email && u.password === password) {
        this.l.ruolo = u.ruolo;
        this.l.isLoginOK = true;
        console.log('utente trovato: può accedere come ' + this.l.ruolo);
        // if(u.email === 'simone@gmail.com'){
        // this.id = 77
        // console.log('id cambiato')
        // }
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

  getLruolo(): string {
    return this.l.ruolo;
  }

  setResponse(response: string): void {
    this.storage.setLocal(this.ruolo, response);
  }

  isGranted() {
    return this.storage.getLocal<string>(this.ruolo);
  }
}
