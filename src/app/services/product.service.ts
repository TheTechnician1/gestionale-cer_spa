import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from '../../environments/environment';
import { ProductDetail, ProductSummary } from '../models';

@Injectable({ providedIn: 'root' })
export class ProductService {
  private readonly apiUrl = `${environment.apiBaseUrl}/api/products`;
  readonly placeholderImage = 'assets/logo.png';

  constructor(private readonly http: HttpClient) {}

  list(): Observable<ProductSummary[]> {
    return this.http.get<ProductSummary[]>(this.apiUrl).pipe(map((items) => this.onlyAvailable(items)));
  }

  detail(id: number): Observable<ProductDetail> {
    return this.http.get<ProductDetail>(`${this.apiUrl}/${id}`).pipe(map((item) => this.normalizeProduct(item) as ProductDetail));
  }

  searchByName(name: string): Observable<ProductSummary[]> {
    const query = name.trim();
    if (!query) return this.list();
    return this.http.get<ProductSummary[]>(`${this.apiUrl}/search`, {
      params: new HttpParams().set('name', query)
    }).pipe(map((items) => this.onlyAvailable(items)));
  }

  advancedSearch(filters: { category?: string; minPrice?: number | null; maxPrice?: number | null; minQuantity?: number | null }): Observable<ProductSummary[]> {
    let params = new HttpParams();
    if (filters.category) params = params.set('category', filters.category);
    if (filters.minPrice !== null && filters.minPrice !== undefined) params = params.set('minPrice', String(filters.minPrice));
    if (filters.maxPrice !== null && filters.maxPrice !== undefined) params = params.set('maxPrice', String(filters.maxPrice));
    if (filters.minQuantity !== null && filters.minQuantity !== undefined) params = params.set('minQuantity', String(filters.minQuantity));

    if (!params.keys().length) return this.list();
    return this.http.get<ProductSummary[]>(`${this.apiUrl}/advanced-search`, { params }).pipe(map((items) => this.onlyAvailable(items)));
  }

  imageFor(image?: string | null): string {
    if (!image || !image.trim()) return this.placeholderImage;
    return image;
  }

  private onlyAvailable(items: ProductSummary[]): ProductSummary[] {
    return items.filter((item) => Number(item.quantitaDisponibile) > 0).map((item) => this.normalizeProduct(item));
  }

  private normalizeProduct<T extends ProductSummary>(item: T): T {
    return {
      ...item,
      prezzo: Number(item.prezzo),
      quantitaDisponibile: Number(item.quantitaDisponibile),
      immagine: this.imageFor(item.immagine)
    };
  }
}
