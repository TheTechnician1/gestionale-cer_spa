import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable, tap } from 'rxjs';
import {
  AccessoRequest,
  GetListaCER,
  ImpiantoCER,
  RegistrazioneUtente,
  RicercaCerRequest,
  Utente,
  UtenteModel,
} from '../interfaces/user.model';
import { HttpClient } from '@angular/common/http';
import { ApiService } from './api.service';
import { Router } from '@angular/router';
import { CerService } from './cer.service';
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
  private readonly accessoStorageKey = "accessoRequest";
  private readonly tokenKey = "auth_token";
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

  constructor(
    private http: HttpClient,
    private apiService: ApiService,
    private router: Router,
    private cerService: CerService
  ) {}

  // Login mock: simula una chiamata al backend e salva l'utente in memoria + localStorage.
  // È usato durante lo sviluppo per testare il flusso di autenticazione.
  login(payload: { email: string |null; password: string | null }): Observable<UtenteModel> {
    
    const endpoint = "/utente/accedi"
    
    return this.apiService.post<Utente>(endpoint, payload).pipe(
      map((utente) => new UtenteModel({ ...utente, email: payload.email })),
      tap((utente) => {
        this.persistUser(utente);
        this.persistToken(utente.token);
        this.persistAccessoRequest(payload);
      }),
    );
  }

  registraUtente(payload: RegistrazioneUtente): Observable<RegistrazioneUtente> {
    const endpoint = "/utente/inserisci"
    return this.apiService.post<RegistrazioneUtente>(endpoint, payload)
  }

  getTabellaCER(payload: RicercaCerRequest = {}): Observable<GetListaCER[]>{
    return this.cerService.ricercaCer(payload)
  }

  visualizzaCer(idCer: number): Observable<GetListaCER> {
    return this.cerService.visualizzaCer(idCer);
  }

  ricercaImpianti(payload: {
    partitaIva?: string;
    regione?: string;
    provincia?: string;
    comune?: string;
    codiceCabina?: string;
  }): Observable<ImpiantoCER[]> {
    return this.cerService.ricercaImpianti(payload);
  }

  getAccessoRequest(): AccessoRequest | null {
    const raw = sessionStorage.getItem(this.accessoStorageKey);
    if (!raw) {
      return null;
    }

    try {
      const parsed = JSON.parse(raw) as AccessoRequest;
      return parsed.email && parsed.password ? parsed : null;
    } catch {
      sessionStorage.removeItem(this.accessoStorageKey);
      return null;
    }
  }

  isGranted(): string | null {
    return this.currentUser?.ruolo ?? null;
  }

 // getTabellaCER(): Observable<GetListaCER[]>{
    // const endpoint = "/cer/visualizza-lista-completa"
  //   return this.apiService.get<GetListaCER[]>(endpoint)
  // }

  


  // Logout: rimuove l'utente sia dalla memoria reattiva che dal localStorage,
  // così l'app torna allo stato "non autenticato".
  logout(): void {
    localStorage.removeItem(this.storageKey);
    localStorage.removeItem(this.tokenKey);
    sessionStorage.removeItem(this.tokenKey);
    sessionStorage.removeItem(this.accessoStorageKey);
    this.userSubject.next(null);
    this.router.navigate(['/login']);
    
  }

  // Salva l'utente e notifica tutti gli iscritti (sidebar, header, guard, ecc.).
  private persistUser(utente: UtenteModel): void {
    localStorage.setItem(this.storageKey, JSON.stringify(utente));
    this.userSubject.next(utente);
  }

  private persistAccessoRequest(payload: {
    email: string | null;
    password: string | null;
  }): void {
    if (!payload.email || !payload.password) {
      sessionStorage.removeItem(this.accessoStorageKey);
      return;
    }

    sessionStorage.setItem(
      this.accessoStorageKey,
      JSON.stringify({ email: payload.email, password: payload.password })
    );
  }

  private persistToken(token?: string | null): void {
    if (!token) {
      localStorage.removeItem(this.tokenKey);
      sessionStorage.removeItem(this.tokenKey);
      return;
    }

    localStorage.setItem(this.tokenKey, JSON.stringify(token));
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
