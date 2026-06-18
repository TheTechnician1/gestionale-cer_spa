import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';

import { CarrelloResponse } from '../models/carrello-response';

@Injectable({
  providedIn: 'root',
})
export class CarrelloService {
  private readonly apiUrl = 'http://localhost:8080/api/carrello';
  private readonly carrelloConProdottiSubject = new BehaviorSubject<boolean>(false);

  carrelloConProdotti$ = this.carrelloConProdottiSubject.asObservable();

  constructor(private httpClient: HttpClient) {}

  recuperaCarrelloUtente(idUtente: number): Observable<CarrelloResponse[]> {
    return this.httpClient
      .get<CarrelloResponse[]>(`${this.apiUrl}/${idUtente}`)
      .pipe(tap((carrello) => this.aggiornaStatoCarrello(carrello)));
  }

  aggiungiProdottoAlCarrello(
    idUtente: number,
    idProdotto: number,
    quantita: number,
  ): Observable<CarrelloResponse[]> {
    return this.httpClient
      .post<CarrelloResponse[]>(
        `${this.apiUrl}/${idUtente}/prodotti/${idProdotto}?quantita=${quantita}`,
        null,
      )
      .pipe(tap((carrello) => this.aggiornaStatoCarrello(carrello)));
  }

  modificaQuantitaProdotto(
    idUtente: number,
    idProdotto: number,
    quantita: number,
  ): Observable<CarrelloResponse[]> {
    return this.httpClient
      .put<CarrelloResponse[]>(
        `${this.apiUrl}/${idUtente}/prodotti/${idProdotto}?quantita=${quantita}`,
        null,
      )
      .pipe(tap((carrello) => this.aggiornaStatoCarrello(carrello)));
  }

  rimuoviProdottoDalCarrello(
    idUtente: number,
    idProdotto: number,
  ): Observable<CarrelloResponse[]> {
    return this.httpClient
      .delete<CarrelloResponse[]>(`${this.apiUrl}/${idUtente}/prodotti/${idProdotto}`)
      .pipe(tap((carrello) => this.aggiornaStatoCarrello(carrello)));
  }

  svuotaCarrello(idUtente: number): Observable<void> {
    return this.httpClient
      .delete<void>(`${this.apiUrl}/${idUtente}`)
      .pipe(tap(() => this.carrelloConProdottiSubject.next(false)));
  }

  pulisciStatoCarrello(): void {
    this.carrelloConProdottiSubject.next(false);
  }

  private aggiornaStatoCarrello(carrello: CarrelloResponse[]): void {
    this.carrelloConProdottiSubject.next(carrello.length > 0);
  }
}
