export interface Prodotto {
  idProdotto: number;
  nomeProdotto: string;
  descrizioneBreve: string;
  descrizioneCompleta: string;
  prezzo: number;
  quantitaDisponibile: number;
  categoria: string;
  immagine: string;
  venditore: VenditoreDTO;
}

export class ProdottoModel implements Prodotto {
    idProdotto!: number;
    nomeProdotto!: string;
    descrizioneBreve!: string;
    descrizioneCompleta!: string;
    prezzo!: number;
    quantitaDisponibile!: number;
    categoria!: string;
    immagine!: string;
    venditore!: VenditoreDTO;
      constructor(init?: Partial<Prodotto>) {
    Object.assign(this,init);
  }
}

export interface VenditoreDTO {
  id: number;
  nome: string;
  email: string;
}

export class VenditoreDTOModel implements VenditoreDTO {
    id!: number;
    nome!: string;
    email!: string;
      constructor(init?: Partial<VenditoreDTO>) {
    Object.assign(this,init);
  } 
}
