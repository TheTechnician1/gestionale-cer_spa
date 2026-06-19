import { Injectable } from "@angular/core";
import { ApiService } from "./api.service";
import { User } from "../interfaces/user.model";
import { BehaviorSubject, map, Observable, tap } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class AuthService {

  private readonly storageKey = "user";
  private readonly userSubject = new BehaviorSubject<User | null>(this.loadFromStorage());
  readonly user$ = this.userSubject.asObservable();
  readonly isLoggedIn$ = this.user$.pipe(map((user) => !!user));

  constructor(private apiService: ApiService) {}

  get currentUser(): User | null {
    return this.userSubject.value;
  }

  login(payload: { email: string; password: string }) {
    return this.apiService.post<User>("/api/auth/login", payload)
      .pipe(
        tap(user => {
          localStorage.setItem("user", JSON.stringify(user));
          this.userSubject.next(user);
        })
      );
  }

  logout(): void {
    localStorage.removeItem("user");
    this.userSubject.next(null);
  }

   register(payload: Partial<User>): Observable<User> {
    return this.apiService.post<User>("/api/auth/register", payload);
  }

  private persistUser(user: User): void {
    localStorage.setItem(this.storageKey, JSON.stringify(user));
    this.userSubject.next(user);
  }

  private loadFromStorage(): User | null {
    const raw = localStorage.getItem(this.storageKey);
    if (!raw) {
      return null;
    }

    try {
      return JSON.parse(raw) as User;
    } catch {
      localStorage.removeItem(this.storageKey);
      return null;
    }
  }
 
}
