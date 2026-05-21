export interface Cer {

    idCer : number;
    ragSociale :  string;
    codFisc : string;
    partitaIva : string;
    comuneLegale : string;
    provinciaLegale : string;
    regioneLegale : string;
    formaGiuridica : string;
    eMail : string;
    pec : string;
    sitoWeb : string;
    referente : string;
    flgCancellazione : string;
    specFormaGiuridica : string;
    dataInserimento : Date;
    dataModifica : Date;
    dataCancellazione :   Date;
}

export class CerModel implements Cer {

    idCer! : number;
    ragSociale! :  string;
    codFisc! : string;
    partitaIva! : string;
    comuneLegale! : string;
    provinciaLegale !: string;
    regioneLegale! : string;
    formaGiuridica! : string;
    telefono! : string;
    eMail! : string;
    pec! : string;
    sitoWeb !: string;
    referente! : string;
    flgCancellazione! : string;
    specFormaGiuridica! : string;
    dataInserimento! : Date;
    dataModifica! : Date;
    dataCancellazione! : Date;

    constructor(init?: Partial<Cer>) {
        Object.assign(this,init);
    }
}

export interface CerView {

    idCer : number;
    ragSociale : string;
    codFisc : string;
    comune : string;
    provincia : string;
    regione : string;
    nomeUtente : string;
    cognomeUtente : string;
    pIva : string;
    formaGiuridica : string;
    flgCancellazione : string;
    referente : string;
}

export class CerViewModel {
    idCer! : number;
    ragSociale! : string;
    codFisc! : string;
    comune! : string;
    provincia! : string;
    regione! : string;
    nomeUtente! : string;
    cognomeUtente! : string;
    pIva! : string;
    formaGiuridica! : string;
    flgCancellazione! : string;
    referente! : string;

    constructor(init?: Partial<CerView>) {
        Object.assign(this,init);
    }
}