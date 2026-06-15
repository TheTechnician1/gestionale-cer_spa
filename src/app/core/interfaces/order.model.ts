export interface Ordini {
  id: string;
  date: string;
  total: number;
  status: string;
  items: { id: string; name: string; quantity: number; price: number; image?: string }[];
  shipping?: { method: string; cost: number };
  address?: { street: string; city: string; zip?: string };
}
