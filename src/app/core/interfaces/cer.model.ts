export interface CER {
    id_cer: number,
    ragione_sociale: string,
    codice_fiscale: string,
    partita_iva: string,
    comune_sede_legale: string,
    provincia_sede_legale: string,
    regione_legale: string,
    forma_giuridica: string,
    contatti:
    [
      {
        telefono: string,
        email: string,
        pec: string,
        sito_web: string,
        referente: string
      }
    ];
}
