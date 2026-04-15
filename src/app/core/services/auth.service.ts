import { Injectable } from '@angular/core';
import { StorageService } from './storage.service';
export interface isAuthenticated {
  controllo: Boolean;
  validUser: boolean;
}
export enum Role {
  ADMIN = 'admin',
  GEST = 'gest', //Attenzione potrebbe spaccarsi qui: prima era gestore, adesso è gest (controllare in caso di rottura delle rotte)
  GUEST = 'guest',
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly tokenKey = 'auth_token';
  private user: { role: Role } | null = null;

  constructor(private storage: StorageService) {}

  isAuth: isAuthenticated = {
    controllo: false,
    validUser: false,
  };

  isAuthenticated(): void {
    this.isAuth.controllo = Boolean(
      this.storage.getLocal<string>(this.tokenKey) ||
      this.storage.getSession<string>(this.tokenKey) ||
      this.getRole(),
    );
    this.isAuth.validUser = this.user !== null;
  }

  getIsAuthenticated() {
    return this.isAuth;
  }

  // Example hooks to implement later
  setToken(token: string, rememberMe = true): void {
    if (rememberMe) {
      this.storage.setLocal(this.tokenKey, token);
    } else {
      this.storage.setSession(this.tokenKey, token);
    }
  }

  clearToken(): void {
    this.storage.removeLocal(this.tokenKey);
    this.storage.removeSession(this.tokenKey);
  }

  getRole(): Role | null {
    return this.user?.role ?? null;
  }

  loginAsGuest() {
    this.user = { role: Role.GUEST };
    this.setToken('token_test_guest', true);
  }

  loginAsAdmin() {
    this.user = { role: Role.ADMIN };
    this.setToken('token_test_admin', true);
  }

  loginAsGest() {
    this.user = { role: Role.GEST };
    this.setToken('token_test_gest', true);
  }

  logout() {
    this.clearToken();
    this.user = null;
  }
}
