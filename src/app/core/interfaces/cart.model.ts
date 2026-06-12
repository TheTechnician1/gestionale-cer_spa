export interface Cart {
  id: number | null;
}

export class CartModel implements Cart {
  id: number | null;

  constructor(data?: Partial<Cart>) {
    this.id = data?.id ?? null;
  }
}

export interface CartItem {
  id: number | null;
  productId: number | null;
  nome: string | null;
  prezzo: number | null;
  quantita: number | null;
  prezzoUnitario?: number | null;
  immagine: string | null;
}

export class CartItemModel implements CartItem {
  id: number | null;
  productId: number | null;
  nome: string | null;
  prezzo: number | null;
  quantita: number | null;
  prezzoUnitario?: number | null;
  immagine: string | null;

  constructor(data?: Partial<CartItem>) {
    this.id = data?.id ?? null;
    this.productId = data?.productId ?? null;
    this.nome = data?.nome ?? null;
    this.prezzo = data?.prezzo ?? null;
    this.quantita = data?.quantita ?? null;
    this.prezzoUnitario = data?.prezzoUnitario ?? null;
    this.immagine = data?.immagine ?? null;
  }
}

export type CartItemExtended = CartItem & {
  prezzoOriginale?: number | null;
  prezzoScontato?: number | null;
  sconto?: number | null;
};
