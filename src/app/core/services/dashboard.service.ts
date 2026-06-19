import { Injectable } from "@angular/core";
import { ApiRequestOptions, ApiService } from "./api.service";
import { map, Observable, tap } from "rxjs";
import { Prodotto, ProdottoModel } from "../interfaces/prodotto.model";

@Injectable({
  providedIn: "root",
})
export class DashboardService {
  constructor(private api: ApiService) {}

  prod: ProdottoModel[] = [];

   getDati(): Observable<ProdottoModel[]> {
     const endpoint = "/api/products";
     return this.api.get<Prodotto[]>(endpoint).pipe(
       map((prodotti) => prodotti.map((prodotto) => new ProdottoModel({ ...prodotto }))),
       tap((prodotto) => this.persistProduct(prodotto))
     );


  //   // return this.apiService.postLogin<UtenteLogin>(endpoint, payload).pipe(
  //   //       map((utente) => new UtenteLoginModel({ ...utente })),
  //   //       tap((utente) => this.persistUser(utente)),
  //   //     );
   }

  getDatiByName(payload: any, options: ApiRequestOptions = {}): Observable<any[]> {
    const endpoint = "/api/products/search";
    return this.api.get<Prodotto[]>(endpoint, payload, options).pipe(
       map((prodotti) => prodotti.map((prodotto) => new ProdottoModel({ ...prodotto }))),
       tap((prodotto) => this.persistProduct(prodotto))
     );
  }

  getDatiById(id: number | string, options: ApiRequestOptions = {}): Observable<ProdottoModel> {
    const endpoint = `/api/products/${id}`;
    return this.api.get<Prodotto>(endpoint, undefined, options).pipe(map((prodotto) => new ProdottoModel({ ...prodotto })));
  }

  getDatiByParams(payload: any, options: ApiRequestOptions = {}): Observable<any[]> {
    const endpoint = "/api/products/advanced-search";
    return this.api.get<Prodotto[]>(endpoint, payload, options).pipe(
       map((prodotti) => prodotti.map((prodotto) => new ProdottoModel({ ...prodotto }))),
       tap((prodotto) => this.persistProduct(prodotto))
     );;
  }

  private persistProduct(prod: ProdottoModel[]) : void{
    this.prod = prod;
  }

  getProd(){
    return this.prod;
  }





}
