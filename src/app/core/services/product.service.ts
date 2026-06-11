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

  getProductsAdvancedSearch(filters: { category?: string; priceRange?: { min: number; max: number }; minQuantity: number }) {
    const endpoint = '/api/products/advanced-search';
    return this.apiService.post<Prodotto[]>(endpoint, filters);
  }
}
