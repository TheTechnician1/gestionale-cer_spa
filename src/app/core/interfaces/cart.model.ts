export interface Cart {
  id: number | null;
  totale: number | null;
  items: CartItem[] | null;
}

export class CartModel implements Cart {
  id: number | null;
  totale: number | null;
  items: CartItem[] | null;

  constructor(data?: Partial<Cart>) {
    this.id = data?.id ?? null;
    this.totale = data?.totale ?? null;
    this.items = data?.items ?? null;
  }
}

export interface CartItem {
  id: number | null;
  productId: number | null;
  productName: string | null;
  quantita: number | null;
  prezzoUnitario?: number | null;
  prezzoOriginale?: number | null;
  prezzoScontato?: number | null;
  immagine: string | null;
  quantitaDisponibile?: number | null;
  totaleRiga: number | null;
  sellerName: string | null;
  sconto: number | null;
}

export class CartItemModel implements CartItem {
  id: number | null;
  productId: number | null;
  productName: string | null;
  quantita: number | null;
  prezzoUnitario?: number | null;
  prezzoOriginale?: number | null;
  prezzoScontato?: number | null;
  immagine: string | null;
  quantitaDisponibile?: number | null;
  totaleRiga: number | null;
  sellerName: string | null;
  sconto: number | null;

  constructor(data?: Partial<CartItem>) {
    this.id = data?.id ?? null;
    this.productId = data?.productId ?? null;
    this.productName = data?.productName ?? null;
    this.quantita = data?.quantita ?? null;
    this.prezzoUnitario = data?.prezzoUnitario ?? null;
    this.prezzoOriginale = data?.prezzoOriginale ?? null;
    this.prezzoScontato = data?.prezzoScontato ?? null;
    this.immagine = data?.immagine ?? null;
    this.quantitaDisponibile = data?.quantitaDisponibile ?? null;
    this.totaleRiga = data?.totaleRiga ?? null;
    this.sellerName = data?.sellerName ?? null;
    this.sconto = data?.sconto ?? null;
  }
}

export interface CartRequest {
  productId: number,
  quantity: number
};

export type CartItemExtended = CartItem & {
  prezzoOriginale?: number | null;
  prezzoScontato?: number | null;
  sconto?: number | null;
};
