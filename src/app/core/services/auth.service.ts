import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { BehaviorSubject, Observable } from "rxjs";
import { map, tap } from "rxjs/operators";
import { Utente, UtenteModel } from "../interfaces/utente.model";
import { ApiService } from "./api.service";

@Injectable({
  providedIn: "root",
})
export class AuthService {
  // Chiave usata per salvare l'utente autenticato nel localStorage.
  // Serve per ricordare il login anche dopo refresh o riapertura del browser.
  private readonly storageKey = "utente";
  // Stato reattivo dell'utente corrente. È il punto centrale da cui
  // il resto dell'app capisce se l'utente è loggato o meno.
  private readonly userSubject = new BehaviorSubject<UtenteModel | null>(this.loadFromStorage());

  // Stream pubblico dell'utente: i componenti si iscrivono qui per
  // reagire ai cambi di login (sidebar, header, permessi, ecc.).
  readonly user$ = this.userSubject.asObservable();
  // Stream booleano comodo per sapere se l'utente è autenticato.
  readonly isLoggedIn$ = this.user$.pipe(map((user) => !!user));

  // Getter sincrono per recuperare velocemente l'utente corrente
  // (usato ad esempio nelle guardie delle route).
  get currentUser(): UtenteModel | null {
    return this.userSubject.value;
  }

  constructor(private http: HttpClient, private apiService: ApiService) {}

  // Login mock: simula una chiamata al backend e salva l'utente in memoria + localStorage.
  // È usato durante lo sviluppo per testare il flusso di autenticazione.
  loginMock(payload: { utente_email: string; password: string }): Observable<UtenteModel> {
    const endpoint = "/login"
    return this.apiService.post<Utente>(endpoint, payload).pipe(
      map((utente) => new UtenteModel({ ...utente })),
      tap((utente) => this.persistUser(utente)),
    );
  }

  // Login guest: simula l'accesso come ospite (ruolo GUEST).
  // Serve per permettere l'accesso rapido senza credenziali reali.
  loginGuest(payload: { utente_email: string; password: string }): Observable<UtenteModel> {
    const endpoint = "/login"
    return this.apiService.post<Utente>(endpoint, payload).pipe(
      map((utente) => new UtenteModel({ ...utente })),
      tap((utente) => this.persistUser(utente)),
    );
  }

  // Logout: rimuove l'utente sia dalla memoria reattiva che dal localStorage,
  // così l'app torna allo stato "non autenticato".
  logout(): void {
    localStorage.removeItem(this.storageKey);
    this.userSubject.next(null);
  }

  // Salva l'utente e notifica tutti gli iscritti (sidebar, header, guard, ecc.).
  private persistUser(utente: UtenteModel): void {
    localStorage.setItem(this.storageKey, JSON.stringify(utente));
    this.userSubject.next(utente);
  }

  // Recupera l'utente dal localStorage all'avvio dell'app.
  // Serve per ripristinare la sessione dopo un refresh.
  private loadFromStorage(): UtenteModel | null {
    const raw = localStorage.getItem(this.storageKey);
    if (!raw) {
      return null;
    }

    try {
      const parsed = JSON.parse(raw) as Partial<Utente>;
      return new UtenteModel(parsed);
    } catch {
      // Se i dati sono corrotti, puliamo lo storage per evitare errori futuri.
      localStorage.removeItem(this.storageKey);
      return null;
    }
  }
}
