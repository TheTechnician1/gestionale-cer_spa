import { Injectable } from "@angular/core";
import { StorageService } from "./storage.service";

@Injectable({ providedIn: "root" })
export class AuthService {
  private readonly tokenKey = "auth_token";

  constructor(private storage: StorageService) {}

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
