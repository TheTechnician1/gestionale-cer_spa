import { CartItem } from './cart-item.model';

export interface Cart {
  id: number;
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
  createdAt?: string;
  updatedAt?: string;
}