import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { LoginService } from './login.service';

export interface NotificaAdmin {
  id: string;
  titolo: string;
  messaggio: string;
  data: string;
  letta: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class NotificheService {
  private readonly storageKey = 'notificheAdmin';
  private readonly notificheSubject = new BehaviorSubject<NotificaAdmin[]>(
    this.leggiNotifiche()
  );

  readonly notifiche$ = this.notificheSubject.asObservable();

  constructor(private loginService: LoginService) {
    window.addEventListener('storage', (event) => {
      if (event.key === this.storageKey) {
        this.notificheSubject.next(this.leggiNotifiche());
      }
    });
  }

  get totaleNonLette(): number {
    return this.notificheSubject.value.filter((notifica) => !notifica.letta).length;
  }

  visibilePerUtenteCorrente(): boolean {
    return this.loginService.currentUser?.ruolo === 'ADMIN';
  }

  notificaAdmin(titolo: string, messaggio: string): void {
    const notifica: NotificaAdmin = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
      titolo,
      messaggio,
      data: new Date().toISOString(),
      letta: false,
    };

    const notifiche = [notifica, ...this.leggiNotifiche()].slice(0, 50);
    this.salvaNotifiche(notifiche);
  }

  segnaTutteComeLette(): void {
    const notifiche = this.leggiNotifiche().map((notifica) => ({
      ...notifica,
      letta: true,
    }));
    this.salvaNotifiche(notifiche);
  }

  svuota(): void {
    this.salvaNotifiche([]);
  }

  private leggiNotifiche(): NotificaAdmin[] {
    const raw = localStorage.getItem(this.storageKey);

    if (!raw) {
      return [];
    }

    try {
      const notifiche = JSON.parse(raw) as NotificaAdmin[];
      return Array.isArray(notifiche) ? notifiche : [];
    } catch {
      localStorage.removeItem(this.storageKey);
      return [];
    }
  }

  private salvaNotifiche(notifiche: NotificaAdmin[]): void {
    localStorage.setItem(this.storageKey, JSON.stringify(notifiche));
    this.notificheSubject.next(notifiche);
  }
}
