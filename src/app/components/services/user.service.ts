import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from 'src/app/core/interfaces/user.interface';
import { Login } from 'src/app/core/interfaces/login.interface';
import { UserResponse } from 'src/app/core/interfaces/user-response.interface';
import { APP_SETTINGS } from 'src/app/core/config/app-settings';
import { HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private baseUrl = APP_SETTINGS.apiBaseUrl;

  constructor(private http: HttpClient) {}

  registrazione(user: User): Observable<string> {
    return this.http.post(`${this.baseUrl}/api/auth/registrazione`, user, {
      responseType: 'text',
    });
  }

  login(credentials: Login): Observable<UserResponse> {
    return this.http.post<UserResponse>(
      `${this.baseUrl}/api/auth/login`,
      credentials,
    );
  }
  aggiungiSaldo(userId: number, importo: number): Observable<string> {
    return this.http.put(`${this.baseUrl}/api/auth/users/${userId}/saldo`, null, {
        params: new HttpParams().set('importo', importo),
        responseType: 'text'
    });
}
}
