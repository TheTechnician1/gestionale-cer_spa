import { Component } from "@angular/core";
import { Impianto, ImpiantoModel } from "src/app/core/interfaces/impianto.model";

type FiltroRicerca = {
  cer: string | null;
  cabina: string | null;
  regione: string | null;
  provincia: string | null;
  comune: string | null;
};

@Component({
  selector: "app-impianti-ricerca",
  templateUrl: "./impianti-ricerca.component.html",
  styleUrls: ["./impianti-ricerca.component.scss"],
})
export class ImpiantiRicercaComponent {
  //Dati Mock
  impiantiList : Impianto[] = [];

  cerList: string[] = ["CER Milano", "CER Roma", "CER Torino"];
  cabinaList: string[] = ["Cabina Milano", "Cabina Roma", "Cabina Torino"];
  tipologiaList: string [] = ["Fotovoltaico",
    "Agrivoltaico",
    "Eolico on-shore",
    "Eolico off-shore",
    "Idroelittrico",
    "Biomassa",
    "Biogas",
    "Alto (specificare)"];
  regioneList: string[] = [
    "PIEMONTE",
    "VALLE D'AOSTA",
    "LOMBARDIA",
    "PROVINCIA AUTONOMA DI BOLZANO",
    "PROVINCIA AUTONOMA DI TRENTO",
    "VENETO",
    "FRIULI VENEZI GIULIA"
  ];
  provinciaList: string[] = [
    "PD",
    "RG",
    "SV",
    "GE",
    "BZ"
  ];
  comuneList : string [] = ["ABANO TERME",                                       
    "ACATE",                                             
    "ALASSIO",                                           
    "BUSALLA",                                           
    "MARANZA/MERANSEN"];

  selectedCabina: string = "";
  selectedCer: string = "";
  selectedTipologia: string = "";
  selectedRegione: string = "";
  selectedProvincia : string = "";
  selectedComune: string = "";

  filtriSelezionati: FiltroRicerca[] = [];


  ngAfterViewInit(): void {
    this.impiantiList = [
    {
        idImpianto : 11,
        idConfigurazione : 12,
        flgEsercizio : "S",
        dataEserc : null,
        codTipologia : null,
        potenzaNominaleKw : 55,
        flgAccumulo : null,
        capAccumulo :  null,
        tipoProduttore :'S',
        codCatProd : 'Eolico',
        flgCancellazione : null,
        specTipologia : null,
        specCatProduttore :null,
        codSitoInst : null,
        specSitoInst : null,
        statoImpianto : null
    },
        {
        idImpianto : 10,
        idConfigurazione : 14,
        flgEsercizio : "S",
        dataEserc : null,
        codTipologia : 'Agrovoltaico',
        potenzaNominaleKw : 6,
        flgAccumulo : null,
        capAccumulo :  null,
        tipoProduttore :null,
        codCatProd : 'Terra',
        flgCancellazione : null,
        specTipologia : null,
        specCatProduttore :null,
        codSitoInst : null,
        specSitoInst : null,
        statoImpianto : null
    }

    ]
  }
  search(): void {

    console.log("Ricerca avviata");

    const filtro: FiltroRicerca = {
      cer: this.selectedCer,
      cabina: this.selectedCabina,
      regione: this.selectedRegione,
      provincia: this.selectedProvincia,
      comune: this.selectedComune
    };

    this.filtriSelezionati.push(filtro);
  }
}
