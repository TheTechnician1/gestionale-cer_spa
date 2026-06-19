import Decimal from "decimal.js";
import { CategoriaType } from "../enum/categoria.enum";

export interface Prodotto {
  idProdotto?: Number | null;
  nomeProdotto?: string | null;
  descrizioneBreve?: string | null;
  descrizioneCompleta?: string | null;
  prezzo?: Decimal | null;
  quantitaDisponibile?: number | null;
  categoria?: CategoriaType | null;
  immagine?: string | null;
  sellerId?: Number | null;





}

export class ProdottoModel implements Prodotto {
  idProdotto?: Number | null;
  nomeProdotto?: string | null;
  descrizioneBreve?: string | null;
  descrizioneCompleta?: string | null;
  prezzo?: Decimal | null;
  quantitaDisponibile?: number | null;
  categoria?: CategoriaType | null;
  immagine?: string | null;
  sellerId?: Number | null;

  constructor(data?: Partial<Prodotto>) {
    this.idProdotto = data?.idProdotto ?? null;
    this.nomeProdotto = data?.nomeProdotto ?? null;
    this.descrizioneBreve = data?.descrizioneBreve ?? null;
    this.descrizioneCompleta = data?.descrizioneCompleta ?? null;
    this.prezzo = data?.prezzo ?? null;
    this.quantitaDisponibile = data?.quantitaDisponibile ?? null;
    this.categoria = data?.categoria ?? null;
    this.immagine = data?.immagine ?? null;
    this.sellerId = data?.sellerId ?? null;




    
  }
}