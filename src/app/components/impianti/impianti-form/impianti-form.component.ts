import { Component } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ImpiantoService } from "../../services/impianto.service";
import { CodiceDescrizioneBase } from "src/app/core/interfaces/impianto.model";
import { CodiciDescrizioneBaseService } from "../../services/codici-descrizione-base.service";
import { ComboTables } from "src/app/core/enum/comboTable.enum";
import { Observable, of, startWith, switchMap } from "rxjs";

@Component({
  selector: "app-impianti-form",
  templateUrl: "./impianti-form.component.html",
  styleUrls: ["./impianti-form.component.scss"],
})
export class ImpiantiFormComponent {

  formImpianto : FormGroup;
  regioni$? : Observable<CodiceDescrizioneBase[]>;
  provincie$? : Observable<CodiceDescrizioneBase[]>;
  comuni$? : Observable<CodiceDescrizioneBase[]>;
  flag : boolean = false;

  constructor(private fb : FormBuilder, 
    private impiantoService : ImpiantoService,
    private codiciDescrizioneBaseService : CodiciDescrizioneBaseService){
    this.formImpianto = this.fb.group({
        idConfigurazione : [''],
        flagEsercizio : [''],
        dataEntrataEsercizio : [''],
        tipologiaImpianto : [''],
        potenzaNominaleKw : [''],
        presenzaAccumulo : [''],
        capacitaAccumuloKwh : [''],
        categoriaProduttore : [''],
        codiceCategoriaProduttore : [''],
        regione : ['', Validators.required],
        provincia : [{value : '', disabled : true}],
        comune : [{value : '', disabled : true}],
        indirizzo : [''],
        civico : [''],
        cap : [''],
        statoImpianto : [''],
        attivo : [''],
        emailUtenteLoggato : ['']
    });
  }

  ngOnInit(): void {
    this.regioni$ = this.codiciDescrizioneBaseService.getCodiceDescrizioneBase(ComboTables.REGIONI, "");

    this.formImpianto.get('regione')!.valueChanges.subscribe({
      next:(x : CodiceDescrizioneBase)=>{ 
        this.formImpianto.get('provincia')?.setValue(null);
        this.provincie$ = of([]);
        this.formImpianto.get('comune')?.setValue(null);
        this.comuni$ = of([]);
        this.formImpianto.get('comune')?.disable({emitEvent : false});

        this.formImpianto.get('provincia')?.disable({emitEvent : false});

        this.provincie$ = x? this.codiciDescrizioneBaseService
          .getCodiceDescrizioneBase(ComboTables.PROVINCIE, x.codice): of([]);
        this.provincie$.subscribe({
          next:(x: CodiceDescrizioneBase[])=>{
            if(x && x.length> 0){
              this.formImpianto.get('provincia')?.enable({emitEvent : false});
            }
        }})
        return of([]);
      }});

      this.formImpianto.get('provincia')!.valueChanges.subscribe({
        next:(x : CodiceDescrizioneBase)=>{

        this.formImpianto.get('comune')?.setValue(null);
        this.comuni$ = of([]);
        this.comuni$ = x? this.codiciDescrizioneBaseService
          .getCodiceDescrizioneBase(ComboTables.COMUNI, x.codice): of([]);
        this.formImpianto.get('comune')?.disable({emitEvent : false});
        this.comuni$.subscribe({
          next:(x: CodiceDescrizioneBase[])=>{
            if(x && x.length> 0){
              this.formImpianto.get('comune')?.enable({emitEvent : false});
            }
        }})
        return of([]);
      }});
  }

  salvataggio(){


  }
}
