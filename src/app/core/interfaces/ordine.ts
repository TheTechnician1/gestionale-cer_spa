export interface Ordine {
  id: number;
  dataOrdine: string;
  totaleOrdine: number;
  codiceOrdine: string;
  nome: string;
  cognome: string;
  email: string;
  articoliOrdine: ViewArticoloOrdineDTO[];
}

export class Ordine implements Ordine {
  id!: number;
  dataOrdine!: string;
  totaleOrdine!: number;
  codiceOrdine!: string;
  nome!: string;
  cognome!: string;
  email!: string;
  articoliOrdine!: ViewArticoloOrdineDTO[];

  constructor(init?: Partial<Ordine>) {
    Object.assign(this, init);
  }
}

export interface ViewArticoloOrdineDTO {
  idArticoloOrdine: number;
  nomeProdotto: string;
  quantita: number;
  prezzoUnitario: number;
  totaleRiga: number;
  descrizioneBreve: string;
  categoria: string;
  immagine: string;
  nomeVenditore: string;
  emailVenditore: string;
}

export class ViewArticoloOrdineDTO implements ViewArticoloOrdineDTO {
  idArticoloOrdine!: number;
  nomeProdotto!: string;
  quantita!: number;
  prezzoUnitario!: number;
  totaleRiga!: number;
  descrizioneBreve!: string;
  categoria!: string;
  immagine!: string;
  nomeVenditore!: string;
  emailVenditore!: string;

  constructor(init?: Partial<ViewArticoloOrdineDTO>) {
    Object.assign(this, init);
  }
}