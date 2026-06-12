import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Prodotto } from '../interfaces/product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  constructor(private apiService: ApiService) {}

  getAllProducts() {
    const endpoint = '/api/products/';
    return this.apiService.get<Prodotto[]>(endpoint);
  }

  getProductById(id: number) {
    const endpoint = `/api/products/${id}`;
    return this.apiService.get<Prodotto>(endpoint);
  }

  getProductsByName(name: string) {
    const endpoint = `/api/products/search/${name}`;
    return this.apiService.get<Prodotto[]>(endpoint);
  }

  getProductsAdvancedSearch(filters: any) {
    let query = [];
    if (filters.category) query.push(`category=${encodeURIComponent(filters.category)}`);
    if (filters.minPrice != null) query.push(`minPrice=${filters.minPrice}`);
    if (filters.maxPrice != null) query.push(`maxPrice=${filters.maxPrice}`);
    if (filters.minQuantity != null) query.push(`minQuantity=${filters.minQuantity}`);
    const queryString = query.length > 0 ? '?' + query.join('&') : '';
    const endpoint = `/api/products/advanced-search${queryString}`;
    return this.apiService.get<Prodotto[]>(endpoint);
  }
}
