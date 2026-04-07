import { Injectable } from "@angular/core";

@Injectable({ providedIn: "root" })
export class StorageService {
  setLocal<T>(key: string, value: T): void {
    localStorage.setItem(key, this.serialize(value));
  }

  getLocal<T>(key: string): T | null {
    return this.deserialize<T>(localStorage.getItem(key));
  }

  removeLocal(key: string): void {
    localStorage.removeItem(key);
  }

  clearLocal(): void {
    localStorage.clear();
  }

  setSession<T>(key: string, value: T): void {
    sessionStorage.setItem(key, this.serialize(value));
  }

  getSession<T>(key: string): T | null {
    return this.deserialize<T>(sessionStorage.getItem(key));
  }

  removeSession(key: string): void {
    sessionStorage.removeItem(key);
  }

  clearSession(): void {
    sessionStorage.clear();
  }

  private serialize<T>(value: T): string {
    if (value === undefined) return "null";
    return JSON.stringify(value);
  }

  private deserialize<T>(value: string | null): T | null {
    if (value === null) return null;
    try {
      return JSON.parse(value) as T;
    } catch {
      return value as unknown as T;
    }
  }
}
