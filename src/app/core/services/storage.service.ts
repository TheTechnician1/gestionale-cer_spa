import { Injectable } from "@angular/core";

@Injectable({ providedIn: "root" })
export class StorageService {
  // Salva un valore nel localStorage.
  // Serve per dati che devono rimanere anche dopo la chiusura del browser.
  setLocal<T>(key: string, value: T): void {
    localStorage.setItem(key, this.serialize(value));
  }

  // Legge un valore dal localStorage e lo deserializza.
  // Usato per ripristinare lo stato dell'app (es. utente loggato).
  getLocal<T>(key: string): T | null {
    return this.deserialize<T>(localStorage.getItem(key));
  }

  // Rimuove un singolo valore dal localStorage.
  removeLocal(key: string): void {
    localStorage.removeItem(key);
  }

  // Svuota completamente il localStorage.
  // Utile per reset totale dell'app o logout completo.
  clearLocal(): void {
    localStorage.clear();
  }

  // Salva un valore nel sessionStorage.
  // Serve per dati che devono vivere solo finché la scheda è aperta.
  setSession<T>(key: string, value: T): void {
    sessionStorage.setItem(key, this.serialize(value));
  }

  // Legge un valore dal sessionStorage e lo deserializza.
  getSession<T>(key: string): T | null {
    return this.deserialize<T>(sessionStorage.getItem(key));
  }

  // Rimuove un singolo valore dal sessionStorage.
  removeSession(key: string): void {
    sessionStorage.removeItem(key);
  }

  // Svuota completamente il sessionStorage.
  clearSession(): void {
    sessionStorage.clear();
  }

  // Serializza un valore in stringa per poterlo salvare nello storage.
  // Se undefined, salviamo "null" per coerenza.
  private serialize<T>(value: T): string {
    if (value === undefined) return "null";
    return JSON.stringify(value);
  }

  // Deserializza una stringa dallo storage.
  // Se la stringa non è JSON valido, ritorna il valore grezzo.
  private deserialize<T>(value: string | null): T | null {
    if (value === null) return null;
    try {
      return JSON.parse(value) as T;
    } catch {
      return value as unknown as T;
    }
  }
}
