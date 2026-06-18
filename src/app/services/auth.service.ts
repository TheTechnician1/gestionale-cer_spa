import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { LoginRequest } from '../models/login-request';
import { RegisterRequest } from '../models/register-request';
import { UserResponse } from '../models/user-response';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly apiUrl = 'http://localhost:8080/api/auth';

  constructor(private httpClient: HttpClient) {}

  login(request: LoginRequest): Observable<UserResponse> {
    return this.httpClient.post<UserResponse>(`${this.apiUrl}/login`, request);
  }

  register(request: RegisterRequest): Observable<UserResponse> {
    return this.httpClient.post<UserResponse>(
      `${this.apiUrl}/register`,
      request,
    );
  }
}
