import { Injectable } from '@angular/core';

export interface CerElemento {
  id: number;
  ragioneSociale: string;
  partitaIVA: string;
  formaGiuridica: string;
  stato: string;
  flag: string;
}

export interface CerFiltro {
  ragioneSociale: string;
  partitaIVA: string;
  formaGiuridica: string;
  stato: string;
  flag: string;
}

@Injectable({
  providedIn: 'root'
})
export class FiltroService {
  private readonly listaElementi: CerElemento[] = [
    {
      id: 1,
      ragioneSociale: 'CER Energia Pulita',
      partitaIVA: '12345678901',
      formaGiuridica: 'Associazione riconosciuta',
      stato: 'SI-AUT',
      flag: 'Flag terzo settore',
    },
    {
      id: 2,
      ragioneSociale: 'Comunità Sole Futuro',
      partitaIVA: '10987654321',
      formaGiuridica: 'Cooperativa',
      stato: 'NO-AUT-SI-GSE',
      flag: 'Flag cambiamenti climatici',
    }
  ];

  getListaElementi(): CerElemento[] {
    return this.listaElementi;
  }

  filtraElementi(filtro: CerFiltro): CerElemento[] {
    return this.listaElementi.filter((elemento) => {
      const matchRagioneSociale =
        !filtro.ragioneSociale ||
        elemento.ragioneSociale
          .toLowerCase()
          .includes(filtro.ragioneSociale.toLowerCase());

      const matchPartitaIVA =
        !filtro.partitaIVA || elemento.partitaIVA.includes(filtro.partitaIVA);

      const matchFormaGiuridica =
        !filtro.formaGiuridica || elemento.formaGiuridica === filtro.formaGiuridica;

      const matchStato =
        !filtro.stato || elemento.stato === filtro.stato;

      const matchFlag =
        !filtro.flag || elemento.flag === filtro.flag;

      return (
        matchRagioneSociale &&
        matchPartitaIVA &&
        matchFormaGiuridica &&
        matchStato &&
        matchFlag
      );
    });
  }

  cercaElementoPerId(id: number): CerElemento | undefined {
    return this.listaElementi.find((elemento) => elemento.id === id);
  }
}
