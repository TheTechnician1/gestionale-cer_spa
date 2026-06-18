export interface Ordini {
  id: number;
  codiceOrdine: string;
  date: Date;
  total: number;
  status: string;
  itemsCount: number;
  items: { id: string; name: string; quantity: number; price: number; image?: string }[];
  shipping?: { method: string; cost: number };
  address?: { street: string; city: string; zip?: string };
}

export interface OrderDTO {
  orderId: number;
  message: string;
}

export interface OrderItemResponseDTO {
  productId: number;
  productName: string;
  quantity: number;
  prezzoUnitario: number;
  totaleRiga: number;
}

export interface OrderResponseDTO {
  id: number;
  codiceOrdine: string;
  dataOrdine: string;
  totaleOrdine: number;
  stato: string;
  items: OrderItemResponseDTO[];
}
