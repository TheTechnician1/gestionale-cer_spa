export interface Prodotto {
  id: number | null;
  nomeProdotto: string | null;
  descrizioneBreve: string | null;
  descrizioneCompleta: string | null;
  prezzo: number | null;
  quantita: number | null;
  immagine: string | null;
  categoria: string | null;
}

export class ProdottoModel implements Prodotto {
  id: number | null;
  nomeProdotto: string | null;
  descrizioneBreve: string | null;
  descrizioneCompleta: string | null;
  prezzo: number | null;
  quantita: number | null;
  immagine: string | null;
  categoria: string | null;

  constructor(data?: Partial<Prodotto>) {
    this.id = data?.id ?? null;
    this.nomeProdotto = data?.nomeProdotto ?? null;
    this.descrizioneBreve = data?.descrizioneBreve ?? null;
    this.descrizioneCompleta = data?.descrizioneCompleta ?? null;
    this.prezzo = data?.prezzo ?? null;
    this.quantita = data?.quantita ?? null;
    this.immagine = data?.immagine ?? null;
    this.categoria = data?.categoria ?? null;
  }
}
