import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { AuthResponse, User } from '../models';

const SESSION_KEY = 'videa_shop_session';

interface StoredSession {
  user: User;
  sessionToken?: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly apiUrl = `${environment.apiBaseUrl}/api/auth`;
  private readonly userSubject = new BehaviorSubject<User | null>(this.readSession()?.user ?? null);
  readonly user$ = this.userSubject.asObservable();

  constructor(private readonly http: HttpClient) {}

  currentUser(): User | null {
    return this.userSubject.value;
  }

  isLoggedIn(): boolean {
    return Boolean(this.currentUser());
  }

  register(payload: { nome: string; cognome: string; email: string; password: string; saldo: number }): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/register`, payload);
  }

  login(payload: { email: string; password: string }): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, payload).pipe(
      tap((response) => this.saveSession(response))
    );
  }

  logout(): void {
    sessionStorage.removeItem(SESSION_KEY);
    this.userSubject.next(null);
  }

  private saveSession(response: AuthResponse): void {
    const session: StoredSession = {
      user: response.user,
      sessionToken: response.sessionToken
    };
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
    this.userSubject.next(response.user);
  }

  private readSession(): StoredSession | null {
    try {
      const raw = sessionStorage.getItem(SESSION_KEY);
      return raw ? JSON.parse(raw) as StoredSession : null;
    } catch {
      return null;
    }
  }
}
