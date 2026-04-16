import { Role } from './../interfaces/ruolo.model';
import { Injectable } from "@angular/core";
import { StorageService } from "./storage.service";
import { GuestData } from "../interfaces/guest.model";
import { isAuthenticated } from "../interfaces/auth.model";
import { Ruolo } from "../enum/role.enum";
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, map, Observable } from 'rxjs';

@Injectable({ providedIn: "root" })
export class AuthService {
  constructor(private http: HttpClient, private storage: StorageService) {}

  private readonly tokenKey = "auth_token";
  private user: {role: Ruolo} | null = null;

  isAuth: isAuthenticated = {
    check: false,
    validUser: false
  }

  private loggedIn$ = new BehaviorSubject<boolean>(false);


  isAuthenticated(user:any): void {
    this.user = user
    this.isAuth.check = Boolean(this.storage.getLocal<string>(this.tokenKey) || this.storage.getSession<string>(this.tokenKey) || this.getRole());
    this.isAuth.validUser = this.user !== null;
    this.loggedIn$.next(this.isAuth.validUser);
  }

  get isLogged$() {
    return this.loggedIn$.asObservable();
  }

  getIsAuthenticated() {
    return this.isAuth
  }

  setToken(token: string, rememberMe = true): void {
    if(rememberMe) {
      this.storage.setLocal(this.tokenKey, token);
    } else {
      this.storage.setSession(this.tokenKey, token);
    }
  }

  clearToken(): void {
    this.storage.removeLocal(this.tokenKey);
    this.storage.removeSession(this.tokenKey);
  }

  getRole(): Ruolo | null {
    return this.user?.role ?? null;
  }

  loginAsGuest() {
    this.user = { role: Ruolo.GUEST } ;
    this.setToken("token_test_guest", true);
  }

  loginAsAdmin() {
    this.user = { role: Ruolo.ADMIN };
    this.setToken("token_test_admin", true);
  }

  loginAsGest() {
    this.user = { role: Ruolo.GEST };
    this.setToken("token_test_gest", true);
  }

  logout() {
    this.clearToken();
    this.user = null;
    // localStorage.removeItem('token_exp');
    this.loggedIn$.next(false);
  }

  login(email:string, pass:string): Observable<any> {
    return this.http.get<any[]>('../../../assets/guest.json')
      .pipe(
        map((data: any[]) => {
          const user = data.find(p =>
            p.email === email && p.password === pass
          );

        return user ? user : null;
      })
    );
    // poi assegno il login - ruolo
    // ....
  }

  // getToken(): string | null {
  //   return this.storage.getLocal<string>(this.tokenKey)
  //     || this.storage.getSession<string>(this.tokenKey);
  // }

  // isTokenExpired(): boolean {
  //   const exp = localStorage.getItem('token_exp');
  //   if (!exp) return true;

  //   return Date.now() > Number(exp);
  // }

  // getGuestData() {
  //   return this.http.get<GuestData>('../../../assets/guest.json');
  // }
}
