import { Injectable } from "@angular/core";
import { Utente, UtenteModel } from "../interfaces/utente.model";
import { ApiRequestOptions, ApiService } from "./api.service";
import { BehaviorSubject, map, Observable, tap } from "rxjs";
import { ApiResponse } from "../interfaces/api.model";

@Injectable({
  providedIn: "root",
})
export class UtenteService {
  constructor(private apiService: ApiService) {
    const savedUser = localStorage.getItem(this.storageKey);

    if(savedUser) {
      this.userSubject.next(
        new UtenteModel(JSON.parse(savedUser))
      );
    }
  }

  private guestUser: UtenteModel = new UtenteModel({
    id: 26,
    name: 'Guest',
    surname: 'Guest',
    email: 'guest@guest.guest',
    password: 'Guest1@Guest',
    balance: 0
  });

  private readonly storageKey = "utente";
  private userSubject = new BehaviorSubject<UtenteModel>(this.guestUser);
  readonly user$ = this.userSubject.asObservable();
  readonly isLoggedIn$ = this.user$.pipe(map(user => !this.isGuest(user)));

  get currentUser(): UtenteModel | null {
    return this.userSubject.value;
  }

  isGuest(user: UtenteModel | null): boolean {
    return !!user && user.id === this.guestUser.id;
  }

  login(payload: { email: string; password: string }, options: ApiRequestOptions = {}): Observable<UtenteModel> {
    const endpoint = "api/auth/login";
    return this.apiService.post<ApiResponse<Utente>>(endpoint, payload, options).pipe(
      map((res) => new UtenteModel(res.data)),
      tap((utente) => this.persistUser(utente)));
  }

  logout(): void {
    localStorage.removeItem(this.storageKey);
    this.userSubject.next(this.guestUser);
  }

  createUtente(payload: any, options: ApiRequestOptions = {}) {
    const endpoint = "/api/auth/register";
    return this.apiService.post<string>(endpoint, payload, { ...options, responseType: 'text' });
  }

  getBalance(): number {
    const saved = localStorage.getItem('userBalance');
    return saved ? Number(saved) : 0;
  }

  updateUser(id: number, payload: any, options: ApiRequestOptions = {}): Observable<any> {
    const endpoint = `/api/auth/edit/${id}`;
    return this.apiService.post<any>(endpoint, payload, { ...options, responseType: 'text' });
  }

  updateBalance(id: number, balance: number): Observable<any> {
    const endpoint = `/api/auth/edit/${id}/balance`;
    return this.apiService.post<any>(endpoint, null, { params: { balance }, responseType: 'text' }
    ).pipe(
      tap(() => {
        const user = this.userSubject.value;
        const updatedUser = new UtenteModel({
          ...user,
          balance: (user.balance ?? 0) + balance
        });
        this.persistUser(updatedUser);
      })
    );
  }

  applyBalance(balance: number): void {
    const user = this.userSubject.value;
    if (this.isGuest(user)) return;

    this.persistUser(new UtenteModel({
      ...user,
      balance
    }));
  }

  decrementBalance(amount: number): void {
    const user = this.userSubject.value;
    if (this.isGuest(user)) return;

    this.applyBalance(Number(((user.balance ?? 0) - amount).toFixed(2)));
  }

  private persistUser(utente: UtenteModel): void {
    localStorage.setItem(this.storageKey, JSON.stringify(utente));
    this.userSubject.next(utente);
  }

  requestPasswordReset(email: string) {
    const endpoint = `/api/auth/reset-password/request/${encodeURIComponent(email)}`;
    return this.apiService.getText(endpoint);
  }

  resetPassword(payload: any) {
    const endpoint = `/api/auth/reset-password`;
    return this.apiService.post<any>(endpoint, payload, { responseType: 'text' });
  }
}
