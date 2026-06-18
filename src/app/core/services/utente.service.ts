import { Injectable } from "@angular/core";
import { UtenteLogin, UtenteLoginModel } from "../interfaces/utente.model";
import { ApiRequestOptions, ApiService } from "./api.service";
import { BehaviorSubject, map, Observable, tap } from "rxjs";
import { isAuthenticated } from "../interfaces/auth.model";

@Injectable({
  providedIn: "root",
})
export class UtenteService {
  constructor(private apiService: ApiService) {}
  utente?: UtenteLogin;

  private readonly storageKey = "utente";
  private readonly userSubject = new BehaviorSubject<UtenteLoginModel | null>(this.loadFromStorage());
  readonly user$ = this.userSubject.asObservable();
  readonly isLoggedIn$ = this.user$.pipe(map((user) => !!user));
  private user: { email: string } | null = null;
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

  get currentUser(): UtenteLoginModel | null {
    return this.userSubject.value;
  }

  login(payload: { email: string; password: string }, options: ApiRequestOptions = {}): Observable<UtenteLoginModel> {
    const endpoint = "api/auth/login";
    return this.apiService.postLogin<UtenteLogin>(endpoint, payload).pipe(
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
    const path = "/api/auth/register";
    return this.apiService.postText(path, payload, options);
  }

  updateSaldo(payload: any, options: ApiRequestOptions = {}) {
    const path = "/api/user/update-saldo";
    return this.apiService.postText(path, payload, options);
  }
}
