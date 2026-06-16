import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { UserResponse } from '../models/user-response';

@Injectable({
  providedIn: 'root',
})
export class UtenteService {
  private readonly apiUrl = 'http://localhost:8080/api/utenti';

  constructor(private httpClient: HttpClient) {}

  aggiungiFondi(idUtente: number, importo: number): Observable<UserResponse> {
    return this.httpClient.put<UserResponse>(
      `${this.apiUrl}/${idUtente}/fondi`,
      { importo },
    );
  }
}