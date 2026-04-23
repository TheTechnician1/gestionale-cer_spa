import { Injectable } from '@angular/core';

export interface CerElemento {
  id: number;
  ragioneSociale: string;
  partitaIVA: string;
  formaGiuridica: string;
  comune: string;
  provincia: string;
  regione: string;
}

export interface CerFiltro {
  ragioneSociale: string;
  partitaIVA: string;
  formaGiuridica: string;
  comune: string;
  provincia: string;
  regione: string;
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
      comune: 'Milano',
      provincia: 'MI',
      regione: 'Lombardia',
    },
    {
      id: 2,
      ragioneSociale: 'Comunita Sole Futuro',
      partitaIVA: '10987654321',
      formaGiuridica: 'Cooperativa',
      comune: 'Varese',
      provincia: 'VA',
      regione: 'Lombardia',
    },
    {
      id: 3,
      ragioneSociale: 'CER Energia Brianza',
      partitaIVA: '11987450968',
      formaGiuridica: 'Fondazione di partecipazione',
      comune: 'Monza',
      provincia: 'MB',
      regione: 'Lombardia',
    },
    {
      id: 4,
      ragioneSociale: 'CER Lago Pulito',
      partitaIVA: '02745140135',
      formaGiuridica: 'Associazione',
      comune: 'Como',
      provincia: 'CO',
      regione: 'Lombardia',
    },
    {
      id: 5,
      ragioneSociale: 'Rete Energia Sud Milano',
      partitaIVA: '06789120963',
      formaGiuridica: 'Consorzio',
      comune: 'Rozzano',
      provincia: 'MI',
      regione: 'Lombardia',
    },
  ];

  getListaElementi(): CerElemento[] {
    return this.listaElementi;
  }

  filtraElementi(filtro: CerFiltro): CerElemento[] {
    const ragioneSociale = filtro.ragioneSociale.trim().toLowerCase();
    const partitaIVA = filtro.partitaIVA.trim();
    const formaGiuridica = filtro.formaGiuridica.trim();
    const comune = filtro.comune.trim().toLowerCase();
    const provincia = filtro.provincia.trim().toLowerCase();
    const regione = filtro.regione.trim().toLowerCase();

    return this.listaElementi.filter((elemento) => {
      const matchRagioneSociale =
        !ragioneSociale ||
        elemento.ragioneSociale.toLowerCase().includes(ragioneSociale);

      const matchPartitaIVA =
        !partitaIVA || elemento.partitaIVA.includes(partitaIVA);

      const matchFormaGiuridica =
        !formaGiuridica || elemento.formaGiuridica === formaGiuridica;

      const matchComune =
        !comune || elemento.comune.toLowerCase().includes(comune);

      const matchProvincia =
        !provincia || elemento.provincia.toLowerCase().includes(provincia);

      const matchRegione =
        !regione || elemento.regione.toLowerCase().includes(regione);

      return (
        matchRagioneSociale &&
        matchPartitaIVA &&
        matchFormaGiuridica &&
        matchComune &&
        matchProvincia &&
        matchRegione
      );
    });
  }

  cercaElementoPerId(id: number): CerElemento | undefined {
    return this.listaElementi.find((elemento) => elemento.id === id);
  }
}
