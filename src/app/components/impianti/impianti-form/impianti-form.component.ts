import { Component } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ImpiantoService } from "../../services/impianto.service";
import { CodiceDescrizioneBase, CodiceDescrizioneBaseModel, Impianto, ImpiantoModel } from "src/app/core/interfaces/impianto.model";
import { CodiciDescrizioneBaseService } from "../../services/codici-descrizione-base.service";
import { ComboTables } from "src/app/core/enum/comboTable.enum";
import { Observable, of, startWith, switchMap } from "rxjs";
import { ConfigurazioneView } from "src/app/core/interfaces/configurazione.model";
import { ConfigurazioniService } from "../../services/configurazioni.service";
import { UtenteService } from "src/app/core/services/utente.service";
import { Router } from "@angular/router";

@Component({
  selector: "app-impianti-form",
  templateUrl: "./impianti-form.component.html",
  styleUrls: ["./impianti-form.component.scss"],
})
export class ImpiantiFormComponent {

  formImpianto : FormGroup;

  //OBSERVABLE FORM
  configurazioni$? : Observable<ConfigurazioneView[]>;
  tipologieImpianto$? : Observable<CodiceDescrizioneBase[]>;
  codiciCategoriaProduttore$? : Observable<CodiceDescrizioneBase[]>;
  tipologieSitoInstallazione$? : Observable<CodiceDescrizioneBase[]>;

  regioni$? : Observable<CodiceDescrizioneBase[]>;
  provincie$? : Observable<CodiceDescrizioneBase[]>;
  comuni$? : Observable<CodiceDescrizioneBase[]>;

  //ABILITAZIONE SPECIFICHE
  specificaTipologiaImpianto : boolean = false;
  specificaCategoriaProduttore : boolean = false;
  specificaSitoInstallazione : boolean = false;

  constructor(private fb : FormBuilder, 
    private impiantoService : ImpiantoService,
    private configurazioniService : ConfigurazioniService,
    private utenteService : UtenteService,
    private router : Router,
    private codiciDescrizioneBaseService : CodiciDescrizioneBaseService){
    this.formImpianto = this.fb.group({
      idConfigurazione : ['',Validators.required],
      flagEsercizio : ['', Validators.required],
      dataEntrataEsercizio : ['', Validators.required],
      tipologiaImpianto : ['', Validators.required],
      potenzaNominaleKw : ['', Validators.required],
      presenzaAccumulo : ['', Validators.required],
      capacitaAccumuloKwh : ['', Validators.required],
      categoriaProduttore : ['', Validators.required],
      codiceCategoriaProduttore : ['', Validators.required],
      specificaTipologiaImpianto : [''],
      specificaCategoriaProduttore : [''],
      tipologiaSitoInstallazione : ['', Validators.required],
      specificaSitoInstallazione : [''],
      regione : ['', Validators.required],
      provincia : [{value : '', disabled : true}, Validators.required],
      comune : [{value : '', disabled : true}, Validators.required],
      indirizzo : ['', Validators.required],
      civico : ['', Validators.required],
      cap : ['', Validators.required],
      statoImpianto : ['', Validators.required],
      attivo : ['', Validators.required],
    });
  }

  ngOnInit(): void {
    //FORM OPZIONI CONFIGURAZIONI
    this.configurazioni$ = this.configurazioniService.getAllConfigurazione();
    //FORM OPZIONI TIPOLOGIE IMPIANTO
    this.tipologieImpianto$ = this.codiciDescrizioneBaseService.getCodiceDescrizioneBase(ComboTables.TIPOLOGIA,"");
    //FORM OPZIONI CODICI CATEGORIA PRODUTTORE
    this.codiciCategoriaProduttore$ = this.codiciDescrizioneBaseService.getCodiceDescrizioneBase(ComboTables.PRODUTTORE,"");
    //FORM OPZIONI TIPOLOGIE SITO INSTALLAZIONE
    this.tipologieSitoInstallazione$ = this.codiciDescrizioneBaseService.getCodiceDescrizioneBase(ComboTables.INSTALLAZIONE,"")
    //FORM OPZIONI REGIONE
    this.regioni$ = this.codiciDescrizioneBaseService.getCodiceDescrizioneBase(ComboTables.REGIONI, "");
    //FORM OPZIONI PROVINCIA
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
    //FORM OPZIONI COMUNE
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
    //ABILITAZIONE SPECIFICHE
    this.formImpianto.get('tipologiaImpianto')!.valueChanges.subscribe({
      next:(x : string)=>{
        this.specificaTipologiaImpianto = x === 'Alto (specificare)'? true : false;
      }
    });

    this.formImpianto.get('codiceCategoriaProduttore')!.valueChanges.subscribe({
      next:(x : string)=>{
        this.specificaCategoriaProduttore = x === 'Altro (specificare)'? true : false;
      }
    });

    this.formImpianto.get('tipologiaSitoInstallazione')!.valueChanges.subscribe({
      next:(x : string)=>{
        this.specificaSitoInstallazione = x === 'Altro (specificare)'? true : false;
      }
    });

  }

  salvataggio(){
    const nuovoImpianto : Impianto = new ImpiantoModel ({
      idConfigurazione :  Number(this.formImpianto.get('idConfigurazione')?.value),
      flagEsercizio : this.formImpianto.get('flagEsercizio')?.value,
      dataEntrataEsercizio : this.formImpianto.get('dataEntrataEsercizio')?.value,
      tipologiaImpianto : this.formImpianto.get('tipologiaImpianto')?.value,
      potenzaNominaleKw : this.formImpianto.get('potenzaNominaleKw')?.value,
      presenzaAccumulo : this.formImpianto.get('presenzaAccumulo')?.value,
      capacitaAccumuloKwh : this.formImpianto.get('capacitaAccumuloKwh')?.value,
      categoriaProduttore : this.formImpianto.get('categoriaProduttore')?.value,
      codiceCategoriaProduttore : this.formImpianto.get('codiceCategoriaProduttore')?.value,
      specificaTipologiaImpianto : this.formImpianto.get('specificaTipologiaImpianto')?.value,
      specificaCategoriaProduttore : this.formImpianto.get('specificaCategoriaProduttore')?.value,
      tipologiaSitoInstallazione : this.formImpianto.get('tipologiaSitoInstallazione')?.value,
      specificaSitoInstallazione : this.formImpianto.get('specificaSitoInstallazione')?.value,
      regione : this.formImpianto.get('regione')?.value,
      provincia : this.formImpianto.get('provincia')?.value,
      comune : this.formImpianto.get('comune')?.value,
      indirizzo : new CodiceDescrizioneBaseModel({codice : '',descrizione: this.formImpianto.get('indirizzo')?.value, specifica: ''}),
      civico : new CodiceDescrizioneBaseModel({codice:'',descrizione: this.formImpianto.get('civico')?.value, specifica : ''}),
      cap : new CodiceDescrizioneBaseModel({codice : '',descrizione: this.formImpianto.get('cap')?.value, specifica: ''}),
      statoImpianto : this.formImpianto.get('statoImpianto')?.value,
      attivo : this.formImpianto.get('attivo')?.value,
      emailUtenteLoggato : this.utenteService.currentUser?.mail ?? ''
    });
    console.log("utente creatore: " + this.utenteService.currentUser?.mail);
    console.log(JSON.stringify(nuovoImpianto));

    this.impiantoService.createImpianto(nuovoImpianto).subscribe({
      next: (x: Impianto) =>{
         this.router.navigate(['/impianto/visualizza']);
      },
      error: (err)=>{
        alert("Errore durante la creazione dell'impianto. Riprova più tardi.");
      }
    });

    
  }
}
