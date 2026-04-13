import { Injectable } from "@angular/core";
import { StorageService } from "./storage.service";
import { BehaviorSubject } from "rxjs";

@Injectable({ providedIn: "root" })
export class AuthService {
  constructor(private storage: StorageService) {}

  private readonly tokenKey = "auth_token";

  private loggedIn$ = new BehaviorSubject<boolean>(false);
  private fakeUser = {
    email: 'test@test.com',
    password: '12345678'
  };
  login(email: string, password: string): Promise<boolean> {
    return new Promise(resolve => {
      setTimeout(() => {
        const success =
          email === this.fakeUser.email &&
          password === this.fakeUser.password;

        if(success) {
          localStorage.setItem('logged', 'true');
          this.loggedIn$.next(true);
        }

        resolve(success);
      }, 1000);
    });
  }

  get isLogged$() {
    return this.loggedIn$.asObservable();
  }

  logout() {
    localStorage.removeItem('logged');
    this.loggedIn$.next(false);
  }

  isAuthenticated(): boolean {
    return Boolean(this.storage.getLocal<string>(this.tokenKey) || this.storage.getSession<string>(this.tokenKey));
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
}
