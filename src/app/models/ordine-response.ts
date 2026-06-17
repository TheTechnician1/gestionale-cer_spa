export interface OrdineResponse {
  idOrdine: number;
  idUtente: number;
  codiceOrdine: string;
  dataOrdine: string;
  stato: string;
  totaleOrdine: number;
  saldoResiduo: number;
  numeroArticoli: number;
}
