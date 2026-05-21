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
    // 1. Grab the raw current state value
    const state = this.userSubject.value as any;

    if (!state) {
      console.warn('getRole(): Nessun utente trovato nello stato!');
      return null;
    }

    console.log('getRole(): Stato utente corrente caricato:', state);

    // 2. Safely dig into the exact JSON keys matching your backend payload
    if (state.utente && state.utente.ruolo) {
      console.log(
        'getRole(): Ruolo estratto con successo ->',
        state.utente.ruolo,
      );
      return state.utente.ruolo as RoleType;
    }

    // Fallback for flat object structures
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
    return this.apiService.postLogin<any>(endpoint, payload, options).pipe(
      // 🚀 Save the RAW backend payload directly instead of instantiating the old model class
      tap((userData) => this.persistUser(userData)),
    );
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
      // 🚀 Return the raw parsed JSON directly to keep the exact backend object tree intact
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
