import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CerService {

  private apiUrl = 'http://localhost:8080';

  constructor(
    private http: HttpClient
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
}