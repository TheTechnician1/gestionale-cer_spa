import { Injectable } from "@angular/core";
import { Utente, UtenteModel } from "../interfaces/utente.model";
import { ApiRequestOptions, ApiService } from "./api.service";
import { BehaviorSubject, map, Observable, tap } from "rxjs";
import { ApiResponse } from "../interfaces/api.model";

@Injectable({
  providedIn: "root",
})
export class UtenteService {
  constructor(private apiService: ApiService) {}

  private readonly storageKey = "utente";
  private readonly userSubject = new BehaviorSubject<UtenteModel | null>(this.loadFromStorage());
  readonly user$ = this.userSubject.asObservable();
  readonly isLoggedIn$ = this.user$.pipe(map((user) => user !== null));

  get currentUser(): UtenteModel | null {
    return this.userSubject.value;
  }

  login(payload: { email: string; password: string }, options: ApiRequestOptions = {}): Observable<UtenteModel> {
    const endpoint = "api/auth/login";
    return this.apiService.post<ApiResponse<Utente>>(endpoint, payload, options).pipe(
      map((res) => new UtenteModel(res.data)),
      tap((utente) => this.persistUser(utente)),
    );
  }

  logout(): void {
    localStorage.removeItem(this.storageKey);
    this.userSubject.next(null);
  }

  createUtente(payload: any, options: ApiRequestOptions = {}) {
    const endpoint = "/api/auth/register";
    return this.apiService.post<string>(endpoint, payload, { ...options, responseType: 'text' });
  }

  getBalance(): number {
    const saved = localStorage.getItem('userBalance');
    return saved ? Number(saved) : 0;
  }

  updateBalance(newBalance: number) {
    const user = this.currentUser;

    if (user) {
      user.balance = newBalance;
      localStorage.setItem(this.storageKey, JSON.stringify(user));
      this.userSubject.next(user);
    }

    localStorage.setItem('userBalance', String(newBalance));
  }

  private persistUser(utente: UtenteModel): void {
    localStorage.setItem(this.storageKey, JSON.stringify(utente));
    this.userSubject.next(utente);
  }

  private loadFromStorage(): UtenteModel | null {
    const raw = localStorage.getItem(this.storageKey);
    if (!raw) {
      return null;
    }

    try {
      const parsed = JSON.parse(raw) as Partial<Utente>;
      return new UtenteModel(parsed);
    } catch {
      localStorage.removeItem(this.storageKey);
      return null;
    }
  }
}
