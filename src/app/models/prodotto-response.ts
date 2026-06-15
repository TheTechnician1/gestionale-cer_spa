export interface ProdottoResponse {
  idProdotto: number;
  nomeProdotto: string;
  descrizioneBreve: string;
  descrizioneCompleta: string;
  prezzo: number;
  quantitaDisponibile: number;
  immagine: string;
  venditoreId: number;
  venditoreNome: string;
  categoriaId: number;
  categoriaNome: string;
}
