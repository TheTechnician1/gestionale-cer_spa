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
    return this.currentUser?.ruolo ?? null;
  }

  get currentUser(): UtenteLoginModel | null {
    return this.userSubject.value;
  }

  // login(
  //   payload: { utente_email: string; password: string },
  //   options: ApiRequestOptions = {},
  // ): Observable<UtenteLoginModel> {
  //   const endpoint = 'autenticazione/logIn';
  //   return this.apiService
  //     .postLogin<UtenteLogin>(endpoint, payload, options)
  //     .pipe(
  //       map((utente) => new UtenteLoginModel({ ...utente })),
  //       tap((utente) => this.persistUser(utente)),
  //     );
  // }

  login(
    payload: { utente_email: string; password: string },
    options: ApiRequestOptions = {},
  ): Observable<UtenteLoginModel> {
    const endpoint = 'api/auth/login';
    const body = {
      utenteEmail: payload.utente_email,
      password: payload.password,
    };
    return this.apiService.postLogin<UtenteLogin>(endpoint, body, options).pipe(
      map((utente) => new UtenteLoginModel({ ...utente })),
      tap((utente) => this.persistUser(utente)),
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

  private loadFromStorage(): UtenteLoginModel | null {
    const raw = localStorage.getItem(this.storageKey);
    if (!raw) {
      return null;
    }

    try {
      const parsed = JSON.parse(raw) as Partial<UtenteLogin>;
      return new UtenteLoginModel(parsed);
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
