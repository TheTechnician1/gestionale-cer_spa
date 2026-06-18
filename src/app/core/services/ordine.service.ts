import { Injectable } from '@angular/core';
import { ApiRequestOptions, ApiService } from './api.service';
import { Observable } from 'rxjs';
import { Ordine } from '../interfaces/ordine';
import { ArticoloCarrelloDTO } from '../interfaces/carrello';
import { ToastService } from './toast.service';

@Injectable({
  providedIn: 'root'
})
export class OrdineService {

  constructor(private api: ApiService,
    private toast:ToastService
  ) { }

  visualizzaOrdine(orderId: number|null, options: ApiRequestOptions = {}): Observable<Ordine> {
      const endpoint = `api/orders/${orderId}`;
      return this.api.get<Ordine>(endpoint, {}, options);
  }

  creaOrdine(userId?:number ,ordini? : ArticoloCarrelloDTO[], options: ApiRequestOptions = {}): Observable<Ordine>{
    const endpoint = `api/orders/${userId}/orders/checkout`;
    return this.api.postLogin<Ordine>(endpoint,ordini, options);
  }

  invioRicevuta(orderId: number|null, options: ApiRequestOptions = {}) : void{
    const endpoint = `api/orders/${orderId}/receipt/email`;
    this.api.post<any>(endpoint, {}, options).subscribe({
      next: () => {
        this.toast.success("Invio ricevuta completato")
        console.log('Ricevuta inviata correttamente');
      },
      error: (err) => {
        this.toast.error("Errore durante l'invio della ricevuta")
        console.error('Errore durante l\'invio della ricevuta', err);
      }
    });
  }

}
