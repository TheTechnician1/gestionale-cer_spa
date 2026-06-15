export interface Carrello {
  id: number;
  createdAt: string;
  updatedAt: string;
  idUtente: number;
  articoli: ViewArticoloCarrelloDTO[];
}

export class Carrello implements Carrello{
  id!: number;
  createdAt!: string;
  updatedAt!: string;
  idUtente!: number;
  articoli!: ViewArticoloCarrelloDTO[];

  constructor(init?: Partial<Carrello>) {
    Object.assign(this, init);
  }
}


export interface ViewArticoloCarrelloDTO {
  idArticoloCarrello: number;
  quantita: number;
  idCarrello: number;
  idProdotto: number;
  nomeProdotto: string;
  descrizioneBreve: string;
  descrizioneCompleta: string;
  prezzo: number;
  categoria: string;
}

export class ViewArticoloCarrelloDTOModel implements ViewArticoloCarrelloDTO {
  idArticoloCarrello!: number;
  quantita!: number;
  idCarrello!: number;
  idProdotto!: number;
  nomeProdotto!: string;
  descrizioneBreve!: string;
  descrizioneCompleta!: string;
  prezzo!: number;
  categoria!: string;

  constructor(init?: Partial<ViewArticoloCarrelloDTO>) {
    Object.assign(this, init);
  }
}

export interface ArticoloCarrelloDTO {
  id: number;
  quantita: number;
  prezzoUnitario: number;
  idCarrello: number;
  idProdotto: number;
}

export class ArticoloCarrelloDTOModel implements ArticoloCarrelloDTO {
  id!: number;
  quantita!: number;
  prezzoUnitario!: number;
  idCarrello!: number;
  idProdotto!: number;

  constructor(init?: Partial<ArticoloCarrelloDTO>) {
    Object.assign(this, init);
  }
}