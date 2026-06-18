export interface Ordini {
  id: string;
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
