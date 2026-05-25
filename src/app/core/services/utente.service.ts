import { Injectable } from '@angular/core';
import { UtenteLogin, UtenteLoginModel } from '../interfaces/utente.model';
import { ApiRequestOptions, ApiService } from './api.service';
import { BehaviorSubject, map, Observable, tap } from 'rxjs';
import { Ruolo, RoleType } from '../enum/role.enum';
import { isAuthenticated } from '../interfaces/auth.model';

@Injectable({
  providedIn: 'root',
})
export class UtenteService {
  constructor(private apiService: ApiService) {}
  utente?: UtenteLogin;

  private readonly storageKey = 'utente';
  private readonly userSubject = new BehaviorSubject<UtenteLoginModel | null>(
    this.loadFromStorage(),
  );
  readonly user$ = this.userSubject.asObservable();
  readonly isLoggedIn$ = this.user$.pipe(map((user) => !!user));
  private user: { role: Ruolo } | null = null;
  private loggedIn$ = new BehaviorSubject<boolean>(false);

  isAuth: isAuthenticated = {
    check: false,
    validUser: false,
  };

  isAuthenticated(user: any): void {
    this.user = user;
    this.isAuth.validUser = this.user !== null;
    this.loggedIn$.next(this.isAuth.validUser);
  }

  getIsAuthenticated() {
    return this.isAuth;
  }

  getRole(): RoleType | null {
    const state = this.userSubject.value as any;

    if (!state) {
      console.warn('getRole(): Nessun utente trovato nello stato!');
      return null;
    }

    // 📝 TEMP DEBUGGING LOGS: Look at these in your browser developer console (F12)
    console.log('--- AUTHENTICATION GUARD CHECK ---');
    console.log('Full State Object:', state);
    console.log('Is there an inner utente?:', !!state.utente);
    if (state.utente)
      console.log('Inner Utente Role Field:', state.utente.ruolo);
    console.log('----------------------------------');

    if (state.utente && state.utente.ruolo) {
      console.log(
        'getRole(): Ruolo estratto con successo ->',
        state.utente.ruolo,
      );
      return state.utente.ruolo as RoleType;
    }

    return state.ruolo ?? null;
  }

  get currentUser(): any | null {
    return this.userSubject.value;
  }

  login(
    payload: { utenteEmail: string; password: string },
    options: ApiRequestOptions = {},
  ): Observable<any> {
    const endpoint = 'api/auth/login';
    return this.apiService
      .postLogin<any>(endpoint, payload, options)
      .pipe(tap((userData) => this.persistUser(userData)));
  }

  logout(): void {
    localStorage.removeItem(this.storageKey);
    this.userSubject.next(null);
  }

  private persistUser(utente: UtenteLogin): void {
    this.isAuthenticated(utente);
    localStorage.setItem(this.storageKey, JSON.stringify(utente));
    this.userSubject.next(utente);
  }

  private loadFromStorage(): any | null {
    const raw = localStorage.getItem(this.storageKey);
    if (!raw) return null;

    try {
      return JSON.parse(raw);
    } catch {
      localStorage.removeItem(this.storageKey);
      return null;
    }
  }

  createUtente(payload: any, options: ApiRequestOptions = {}) {
    const path = '/utente/inserisci';
    return this.apiService.postText(path, payload, options);
  }
}
