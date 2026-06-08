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
  id: number;
  quantity: number;
  prezzoUnitario?: number | null;
}

export class CartItemModel implements CartItem {
  id: number;
  quantity: number;
  prezzoUnitario?: number | null;

  constructor(data?: Partial<CartItem>) {
    this.id = data?.id ?? 0;
    this.quantity = data?.quantity ?? 0;
    this.prezzoUnitario = data?.prezzoUnitario ?? null;
  }
}
