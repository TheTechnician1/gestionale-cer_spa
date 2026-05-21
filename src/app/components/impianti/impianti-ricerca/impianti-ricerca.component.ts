import { Component } from "@angular/core";
import { Router } from "@angular/router";
import { Observable, of } from "rxjs";
import { CodiceDescrizioneBase, CodiceDescrizioneBaseModel, Impianto, ImpiantoModel } from "src/app/core/interfaces/impianto.model";
import { CodiciDescrizioneBaseService } from "../../services/codici-descrizione-base.service";
import { FormBuilder, FormGroup } from "@angular/forms";
import { ComboTables } from "src/app/core/enum/comboTable.enum";
import { Cer } from "src/app/core/interfaces/cer.model";
import { ImpiantoService } from "../../services/impianto.service";

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

  impiantiList : Impianto[] = [];
  regioni$? : Observable<CodiceDescrizioneBase[]>;
  provincie$? : Observable<CodiceDescrizioneBase[]>;
  comuni$? : Observable<CodiceDescrizioneBase[]>;
  cer$? : Observable<Cer[]>;
  formRicercaImpianti : FormGroup;

  constructor(private codiciDescrizioneBaseService : CodiciDescrizioneBaseService,
    private fb : FormBuilder,
    private router : Router){
      this.formRicercaImpianti = this.fb.group({
        cer : [''],
        cabina : [''],
        regione : [''],
        provincia : [''],
        comune : ['']
      });

  }

    ngOnInit(): void {
      this.cer$ = this.codiciDescrizioneBaseService.getAllCer();
      this.regioni$ = this.codiciDescrizioneBaseService.getCodiceDescrizioneBase(ComboTables.REGIONI, "");
      this.formRicercaImpianti.get('regione')!.valueChanges.subscribe({
        next:(x : CodiceDescrizioneBase)=>{ 
          this.formRicercaImpianti.get('provincia')?.setValue(null);
          this.provincie$ = of([]);
          this.formRicercaImpianti.get('comune')?.setValue(null);
          this.comuni$ = of([]);
          this.formRicercaImpianti.get('comune')?.disable({emitEvent : false});
  
          this.formRicercaImpianti.get('provincia')?.disable({emitEvent : false});
  
          this.provincie$ = x? this.codiciDescrizioneBaseService
            .getCodiceDescrizioneBase(ComboTables.PROVINCIE, x.codice): of([]);
          this.provincie$.subscribe({
            next:(x: CodiceDescrizioneBase[])=>{
              if(x && x.length> 0){
                this.formRicercaImpianti.get('provincia')?.enable({emitEvent : false});
              }
          }})
          return of([]);
        }});
  
        this.formRicercaImpianti.get('provincia')!.valueChanges.subscribe({
          next:(x : CodiceDescrizioneBase)=>{
  
          this.formRicercaImpianti.get('comune')?.setValue(null);
          this.comuni$ = of([]);
          this.comuni$ = x? this.codiciDescrizioneBaseService
            .getCodiceDescrizioneBase(ComboTables.COMUNI, x.codice): of([]);
          this.formRicercaImpianti.get('comune')?.disable({emitEvent : false});
          this.comuni$.subscribe({
            next:(x: CodiceDescrizioneBase[])=>{
              if(x && x.length> 0){
                this.formRicercaImpianti.get('comune')?.enable({emitEvent : false});
              }
          }})
          return of([]);
        }});

      //Mock
      this.impiantiList = [
        new ImpiantoModel({  idImpianto : 1,
          idConfigurazione :  1,
          flagEsercizio : "S" ,
          dataEntrataEsercizio : new Date(),
          tipologiaImpianto : "Eolico",
          potenzaNominaleKw : 11,
          presenzaAccumulo : "S",
          capacitaAccumuloKwh : 12,
          categoriaProduttore : "Comune",
          codiceCategoriaProduttore : "030",
          regione : new CodiceDescrizioneBaseModel({codice :"",descrizione : "",specifica : ""}),
          provincia : new CodiceDescrizioneBaseModel({codice :"",descrizione : "",specifica : ""}),
          comune : new CodiceDescrizioneBaseModel({codice :"",descrizione : "",specifica : ""}),
          indirizzo : new CodiceDescrizioneBaseModel({codice :"",descrizione : "",specifica : ""}),
          civico : new CodiceDescrizioneBaseModel({codice :"",descrizione : "",specifica : ""}),
          cap : new CodiceDescrizioneBaseModel({codice :"",descrizione : "",specifica : ""}),
          statoImpianto : "S",
          attivo : "S",
          emailUtenteLoggato : "Test"
        })];
    }


  ngAfterViewInit(): void {

  }
  search(): void {
  }

  toForm(){
    this.router.navigate(['impianto/inserimento-impianto']);
  }

  salvataggio(){

  }
}
