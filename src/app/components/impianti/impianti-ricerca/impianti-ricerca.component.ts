import { Component } from "@angular/core";
import { Router } from "@angular/router";
import { Observable, of } from "rxjs";
import { CodiceDescrizioneBase, Impianto, ImpiantoModel } from "src/app/core/interfaces/impianto.model";
import { CodiciDescrizioneBaseService } from "../../services/codici-descrizione-base.service";
import { FormBuilder, FormGroup } from "@angular/forms";
import { ComboTables } from "src/app/core/enum/comboTable.enum";

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
