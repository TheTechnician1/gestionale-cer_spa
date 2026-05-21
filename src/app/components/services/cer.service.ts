import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { ApiService } from 'src/app/core/services/api.service';
import { Cer, CerView } from 'src/app/core/interfaces/cer.model';

@Injectable({
  providedIn: 'root'
})
export class CerService {

  private apiUrl = 'http://localhost:8080';

  constructor(
    private http: HttpClient,
    private apiService :ApiService
  ) {}

  getCer(): Observable<any> {

    return this.http.get(
      `${this.apiUrl}/cer`
    );

  }

  postCer(body: any): Observable<any> {

    return this.http.post(
      `${this.apiUrl}/cer`,
      body
    );
  }

  putCer(id: number, body: any): Observable<any> {
    return this.http.patch(
      `${this.apiUrl}/cer/${id}`,
      body
    );
  }

  //MOCK CHIAMATE
  getCerMock(): Observable<CerView[]>{
    return of(this.cerViewMock);
  }

  //MOCK DATI
  cerViewMock: CerView[] = [
  {
    idCer: 1,
    ragSociale: 'Energia Futura SRL',
    codFisc: '12345678901',
    comune: 'Napoli',
    provincia: 'NA',
    regione: 'Campania',
    nomeUtente: 'Mario',
    cognomeUtente: 'Rossi',
    pIva: 'IT12345678901',
    formaGiuridica: 'SRL',
    flgCancellazione: 'N',
    referente: 'Mario Rossi'
  },
  {
    idCer: 2,
    ragSociale: 'Green Power Cooperativa',
    codFisc: '98765432109',
    comune: 'Salerno',
    provincia: 'SA',
    regione: 'Campania',
    nomeUtente: 'Lucia',
    cognomeUtente: 'Bianchi',
    pIva: 'IT98765432109',
    formaGiuridica: 'Cooperativa',
    flgCancellazione: 'N',
    referente: 'Lucia Bianchi'
  },
  {
    idCer: 3,
    ragSociale: 'Eco Energia SPA',
    codFisc: '45678912345',
    comune: 'Roma',
    provincia: 'RM',
    regione: 'Lazio',
    nomeUtente: 'Giuseppe',
    cognomeUtente: 'Verdi',
    pIva: 'IT45678912345',
    formaGiuridica: 'SPA',
    flgCancellazione: 'S',
    referente: 'Giuseppe Verdi'
  },
  {
    idCer: 4,
    ragSociale: 'Solar Italia SRLS',
    codFisc: '74185296300',
    comune: 'Milano',
    provincia: 'MI',
    regione: 'Lombardia',
    nomeUtente: 'Anna',
    cognomeUtente: 'Neri',
    pIva: 'IT74185296300',
    formaGiuridica: 'SRLS',
    flgCancellazione: 'N',
    referente: 'Anna Neri'
  }
];

}