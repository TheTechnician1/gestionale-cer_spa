export interface ConfigurazioneView{

    codiceCabina : string;
	idCer : number;	
	ragioneSociale : string;
	partitaIva : string;
	regioneLegale : string;
	annoAttivazione : string;
	idConfig : number;
}

export class ConfigurazioneViewModel {

    codiceCabina! : string;
	idCer! : number;	
	ragioneSociale! : string;
	partitaIva! : string;
	regioneLegale! : string;
	annoAttivazione! : string;
	idConfig! : number;

    constructor(init?: Partial<ConfigurazioneView>) {
        Object.assign(this,init);
    }
}