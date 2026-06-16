export interface Order {
    id: number;
    userId: number;
    codiceOrdine: string;
    dataOrdine: string;
    stato: string;
    totaleOrdine: number;
}