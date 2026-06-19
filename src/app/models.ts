export interface ApiErrorBody {
  timestamp?: string;
  status?: number;
  error?: string;
  message?: string;
  path?: string;
}

export interface User {
  id: number;
  nome: string;
  cognome: string;
  email: string;
  saldo: number;
  createdAt?: string;
}

export interface AuthResponse {
  message: string;
  user: User;
  sessionToken?: string;
}

export interface ProductSummary {
  id: number;
  nomeProdotto: string;
  descrizioneBreve: string;
  prezzo: number;
  quantitaDisponibile: number;
  categoria: string;
  immagine?: string | null;
}

export interface Seller {
  id: number;
  nome: string;
  email: string;
  saldo?: number;
}

export interface ProductDetail extends ProductSummary {
  descrizioneCompleta: string;
  seller?: Seller | null;
}

export interface CartItem {
  id: number;
  productId: number;
  nomeProdotto: string;
  immagine?: string | null;
  prezzoUnitario: number;
  quantita: number;
  totaleRiga: number;
}

export interface Cart {
  id: number;
  userId: number;
  createdAt?: string;
  updatedAt?: string;
  totalItems: number;
  totalAmount: number;
  items: CartItem[];
}

export interface OrderItem {
  id: number;
  productId: number;
  productName: string;
  sellerId: number;
  sellerName: string;
  quantita: number;
  prezzoUnitario: number;
  totaleRiga: number;
}

export interface Order {
  id: number;
  userId: number;
  codiceOrdine: string;
  dataOrdine: string;
  stato: string;
  totaleOrdine: number;
  items: OrderItem[];
}

export interface ReceiptEmailResponse {
  message: string;
  recipient: string;
}
