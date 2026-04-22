import { Injectable } from '@angular/core';
import { StorageService } from './storage.service';
import { BehaviorSubject, map, Observable, tap } from 'rxjs';
import { GetListaCER, RegistrazioneUtente, Utente, UtenteModel } from '../interfaces/user.model';
import { HttpClient } from '@angular/common/http';
import { ApiService } from './api.service';
import { Router } from '@angular/router';
export interface Login {
  ruolo: string;
  isLoginOK?: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class LoginService {

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

  constructor(private http: HttpClient, private apiService: ApiService, private router: Router) {}

  // Login mock: simula una chiamata al backend e salva l'utente in memoria + localStorage.
  // È usato durante lo sviluppo per testare il flusso di autenticazione.
  login(payload: { email: string |null; password: string | null }): Observable<UtenteModel> {
    
    const endpoint = "/utente/accedi"
    
    return this.apiService.post<Utente>(endpoint, payload).pipe(
      map((utente) => new UtenteModel({ ...utente })),
      tap((utente) => this.persistUser(utente)),
    );
  }

  registraUtente(payload: RegistrazioneUtente): Observable<RegistrazioneUtente> {
    const endpoint = "/utente/inserisci"
    return this.apiService.post<RegistrazioneUtente>(endpoint, payload)
  }

  getTabellaCER(): Observable<GetListaCER[]>{
    const endpoint = "/cer/visualizza-lista-completa"
    return this.apiService.get<GetListaCER[]>(endpoint)
  }

  


  // Logout: rimuove l'utente sia dalla memoria reattiva che dal localStorage,
  // così l'app torna allo stato "non autenticato".
  logout(): void {
    localStorage.removeItem(this.storageKey);
    this.userSubject.next(null);
    this.router.navigate(['/login']);
    
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
