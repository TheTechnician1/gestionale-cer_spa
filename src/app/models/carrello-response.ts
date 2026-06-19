export interface CarrelloResponse {
  idCarrello: number;
  idUtente: number;
  idElementoCarrello: number;
  idProdotto: number;
  nomeProdotto: string;
  immagine: string;
  quantitaDisponibile: number;
  quantita: number;
  prezzoUnitario: number;
  totaleRiga: number;
  numeroArticoliCarrello: number;
  totaleCarrello: number;
}