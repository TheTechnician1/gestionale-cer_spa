export interface Cer {
    idCer : number | null;
    ragSociale :  string | null;
    codFisc : string | null;
    partitaIva : string | null;
    comuneLegale : string | null;
    provinciaLegale : string | null;
    regioneLegale : string | null;
    formaGiuridica : string | null;
    telefono : string | null;
    eMail : string | null;
    pec : string | null;
    sitoWeb : string | null;
    referente : string | null;
    flgCancellazione : string | null;
    specFormaGiuridica : string | null;
    dataInserimento : Date | null;
    dataModifica : Date | null;
    dataCancellazione :   Date | null;
}

export class CerModel implements Cer {
    idCer : number | null;
    ragSociale :  string | null;
    codFisc : string | null;
    partitaIva : string | null;
    comuneLegale : string | null;
    provinciaLegale : string | null;
    regioneLegale : string | null;
    formaGiuridica : string | null;
    telefono : string | null;
    eMail : string | null;
    pec : string | null;
    sitoWeb : string | null;
    referente : string | null;
    flgCancellazione : string | null;
    specFormaGiuridica : string | null;
    dataInserimento : Date | null;
    dataModifica : Date | null;
    dataCancellazione :   Date | null;

    constructor(data?: Partial<Cer>) {
        this.idCer = data?.idCer ?? null;
        this.ragSociale =  data?.ragSociale ?? null;
        this.codFisc = data?.codFisc ?? null;
        this.partitaIva = data?.partitaIva ?? null;
        this.comuneLegale = data?.comuneLegale ?? null;
        this.provinciaLegale = data?.provinciaLegale ?? null;
        this.regioneLegale = data?.regioneLegale ?? null;
        this.formaGiuridica = data?.formaGiuridica ?? null;
        this.telefono = data?.telefono ?? null;
        this.eMail = data?.eMail ?? null;
        this.pec = data?.pec ?? null;
        this.sitoWeb = data?.sitoWeb ?? null;
        this.referente = data?.referente ?? null;
        this.flgCancellazione = data?.flgCancellazione ?? null;
        this.specFormaGiuridica = data?.specFormaGiuridica ?? null;
        this.dataInserimento = data?.dataInserimento ?? null;
        this.dataModifica = data?.dataModifica ?? null;
        this.dataCancellazione =   data?.dataCancellazione ?? null;
    }
}