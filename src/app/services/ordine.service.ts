import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { OrdineResponse } from '../models/ordine-response';
import { RigaOrdineResponse } from '../models/riga-ordine-response';

@Injectable({
  providedIn: 'root',
})
export class OrdineService {
  private readonly apiUrl = 'http://localhost:8080/api/ordini';

  constructor(private httpClient: HttpClient) {}

  effettuaCheckout(idUtente: number): Observable<OrdineResponse> {
    return this.httpClient.post<OrdineResponse>(
      `${this.apiUrl}/checkout/${idUtente}`,
      null,
    );
  }

  recuperaOrdiniUtente(idUtente: number): Observable<OrdineResponse[]> {
    return this.httpClient.get<OrdineResponse[]>(
      `${this.apiUrl}/utente/${idUtente}`,
    );
  }
  recuperaRigheOrdine(
    idUtente: number,
    idOrdine: number,
  ): Observable<RigaOrdineResponse[]> {
    return this.httpClient.get<RigaOrdineResponse[]>(
      `${this.apiUrl}/utente/${idUtente}/${idOrdine}/righe`,
    );
  }
  scaricaRicevutaPdf(idOrdine: number): Observable<Blob> {
    return this.httpClient.get(`${this.apiUrl}/${idOrdine}/ricevuta/pdf`, {
      responseType: 'blob',
    });
  }

  inviaRicevutaEmail(idOrdine: number): Observable<string> {
    return this.httpClient.post(
      `${this.apiUrl}/${idOrdine}/ricevuta/email`,
      null,
      {
        responseType: 'text',
      },
    );
  }
}
