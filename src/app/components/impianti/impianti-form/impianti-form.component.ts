import { Component } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ImpiantoService } from "../../services/impianto.service";
import { CodiceDescrizioneBase, CodiceDescrizioneBaseModel, Impianto, ImpiantoById, ImpiantoEdit, ImpiantoModel } from "src/app/core/interfaces/impianto.model";
import { CodiciDescrizioneBaseService } from "../../services/codici-descrizione-base.service";
import { ComboTables } from "src/app/core/enum/comboTable.enum";
import { forkJoin, Observable, of, startWith, switchMap } from "rxjs";
import { ConfigurazioneView } from "src/app/core/interfaces/configurazione.model";
import { ConfigurazioniService } from "../../services/configurazioni.service";
import { UtenteService } from "src/app/core/services/utente.service";
import { ActivatedRoute, Router } from "@angular/router";

@Component({
  selector: "app-impianti-form",
  templateUrl: "./impianti-form.component.html",
  styleUrls: ["./impianti-form.component.scss"],
})
export class ImpiantiFormComponent {

  formImpianto : FormGroup;

  //MODALITA MODIFICA
  idEdit? : number | null;
  editedImpianto$? : Observable<ImpiantoById>;
  flagModifica : boolean = false;

  //OBSERVABLE FORM
  configurazioni$? : Observable<ConfigurazioneView[]>;
  tipologieImpianto$? : Observable<CodiceDescrizioneBase[]>;
  codiciCategoriaProduttore$? : Observable<CodiceDescrizioneBase[]>;
  tipologieSitoInstallazione$? : Observable<CodiceDescrizioneBase[]>;
  statiImpianto$? : Observable<CodiceDescrizioneBase[]>;

  regioni$? : Observable<CodiceDescrizioneBase[]>;
  provincie$? : Observable<CodiceDescrizioneBase[]>;
  comuni$? : Observable<CodiceDescrizioneBase[]>;

  //ABILITAZIONE SPECIFICHE
  specificaTipologiaImpianto : boolean = false;
  specificaCategoriaProduttore : boolean = false;
  specificaSitoInstallazione : boolean = false;

  minDate = new Date(1900, 0, 1);

  constructor(private fb : FormBuilder, 
    private impiantoService : ImpiantoService,
    private configurazioniService : ConfigurazioniService,
    private utenteService : UtenteService,
    private router : Router,
    private route: ActivatedRoute,
    private codiciDescrizioneBaseService : CodiciDescrizioneBaseService){
    this.formImpianto = this.fb.group({
      idConfigurazione : ['',Validators.required],
      flagEsercizio : ['', Validators.required],
      dataEntrataEsercizio : ['', Validators.required],
      tipologiaImpianto : ['', Validators.required],
      potenzaNominaleKw : ['', [Validators.required,Validators.min(0)]],
      presenzaAccumulo : ['', Validators.required],
      capacitaAccumuloKwh : ['', [Validators.required,Validators.min(0)]],
      categoriaProduttore : ['', Validators.required],
      codiceCategoriaProduttore : ['', Validators.required],
      specificaTipologiaImpianto : [''],
      specificaCategoriaProduttore : [''],
      tipologiaSitoInstallazione : ['', Validators.required],
      specificaSitoInstallazione : [''],
      regione : ['', Validators.required],
      provincia : [{value : '', disabled : true}, Validators.required],
      comune : [{value : '', disabled : true}, Validators.required],
      indirizzo : ['', [Validators.required,Validators.pattern(/^(?!\s*$)(?!.*\s{2,})[A-Za-zÀ-ÿ0-9\s'.,-]+$/)]],
      civico : ['', [Validators.required,Validators.min(1)]],
      cap : ['', [Validators.required,Validators.minLength(5),Validators.maxLength(5)]],
      statoImpianto : ['', Validators.required],
      attivo : ['N'],
    });
  }

  ngOnInit(): void {

    //VERIFICA INSERIMENTO/MODIFICA
    if(this.router.url.includes("edit")){
      this.idEdit = Number(this.route.snapshot.paramMap.get('id'));
      if(this.idEdit){
        this.editedImpianto$ = this.impiantoService.getImpiantoById(this.idEdit);
        this.editedImpianto$.subscribe({
          error:(x)=>{
            alert("Impianto non trovato");
            this.router.navigate(['/impianto']);
          }
        })

        this.flagModifica = true;
        this.editedImpianto$.subscribe({
          next:(x: ImpiantoById)=>{
            this.formImpianto.patchValue({
              idConfigurazione: x.idConfigurazione,
              flagEsercizio: x.flagEsercizio,
              dataEntrataEsercizio: x.dataEntrataEsercizio,
              tipologiaImpianto: x.tipologiaImpianto,
              potenzaNominaleKw: x.potenzaNominaleKw,
              presenzaAccumulo: x.presenzaAccumulo,
              capacitaAccumuloKwh: x.capacitaAccumuloKwh,
              categoriaProduttore: x.categoriaProduttore,
              codiceCategoriaProduttore: x.codiceCategoriaProduttore,
              specificaTipologiaImpianto: x.specificaTipologiaImpianto,
              specificaCategoriaProduttore: x.specificaCategoriaProduttore,
              tipologiaSitoInstallazione: x.tipologiaSitoInstallazione,
              specificaSitoInstallazione: x.specificaSitoInstallazione,
              indirizzo: x.indirizzo,
              civico: x.civico,
              cap: x.cap,
              statoImpianto: x.statoImpianto,
              attivo: x.attivo
            });
          }
        });
      }
    }

    //FORM OPZIONI CONFIGURAZIONI
    this.configurazioni$ = this.configurazioniService.getAllConfigurazione();
    //FORM OPZIONI TIPOLOGIE IMPIANTO
    this.tipologieImpianto$ = this.codiciDescrizioneBaseService.getCodiceDescrizioneBase(ComboTables.TIPOLOGIA,"");
    //FORM OPZIONI CODICI CATEGORIA PRODUTTORE
    this.codiciCategoriaProduttore$ = this.codiciDescrizioneBaseService.getCodiceDescrizioneBase(ComboTables.PRODUTTORE,"");
    //FORM OPZIONI TIPOLOGIE SITO INSTALLAZIONE
    this.tipologieSitoInstallazione$ = this.codiciDescrizioneBaseService.getCodiceDescrizioneBase(ComboTables.INSTALLAZIONE,"")
    //FORM OPZIONI REGIONE
    forkJoin({
      labelRegioni: this.codiciDescrizioneBaseService.getCodiceDescrizioneBase(ComboTables.REGIONI, ""),
    }).subscribe({
      next: ({ labelRegioni }) => {
        this.regioni$ = of(labelRegioni);
        if(this.flagModifica){
          this.editedImpianto$?.subscribe({
            next:(edited: ImpiantoById)=>{
              this.formImpianto.get('regione')?.patchValue(labelRegioni.find(r => r.descrizione === edited.regione)??null);
            }
          })
        }
      }
    });
    

    //FORM OPZIONI STATO IMPIANTO
    this.statiImpianto$ = this.codiciDescrizioneBaseService.getCodiceDescrizioneBase(ComboTables.STATO, "");
    //FORM OPZIONI PROVINCIA
    this.formImpianto.get('regione')!.valueChanges.subscribe({
      next:(x : CodiceDescrizioneBase)=>{ 
        this.formImpianto.get('provincia')?.setValue(null);
        this.provincie$ = of([]);
        this.formImpianto.get('comune')?.setValue(null);
        this.comuni$ = of([]);
        this.formImpianto.get('comune')?.disable({emitEvent : false});

        this.formImpianto.get('provincia')?.disable({emitEvent : false});

        forkJoin({
          labelProvincie: this.codiciDescrizioneBaseService.getCodiceDescrizioneBase(ComboTables.PROVINCIE, x.codice),
        }).subscribe({
          next: ({ labelProvincie }) => {
            this.provincie$ = of(labelProvincie);
            if(this.flagModifica){
              this.editedImpianto$?.subscribe({
              next:(edited: ImpiantoById)=>{
                this.formImpianto.get('provincia')?.patchValue(labelProvincie.find(r => r.descrizione === edited.provincia)?.descrizione??null);
                console.log("provincia:" + JSON.stringify(this.formImpianto.get('provincia')?.value));
                if(this.formImpianto.get('provincia')){
                  this.formImpianto.get('provincia')?.enable({emitEvent:false});
                }
              }
            })}
            else{
              this.provincie$.subscribe({
                next:(prov:CodiceDescrizioneBase[])=>{
                  if(prov && prov.length>0){
                    this.formImpianto.get('provincia')?.enable({emitEvent:false});
                  }
                }
              })
            }}
        });
      }});
    //FORM OPZIONI COMUNE
    this.formImpianto.get('provincia')!.valueChanges.subscribe({
      next:(x : string)=>{

      this.formImpianto.get('comune')?.setValue(null);
      this.comuni$ = of([]);
      forkJoin({
        labelComuni: this.codiciDescrizioneBaseService.getCodiceDescrizioneBase(ComboTables.COMUNI, x),
      }).subscribe({
          next: ({ labelComuni }) => {
            this.comuni$ = of(labelComuni);
            if(this.flagModifica){
              this.editedImpianto$?.subscribe({
              next:(edited: ImpiantoById)=>{
                this.formImpianto.get('comune')?.patchValue(labelComuni.find(r => r.descrizione.trim() === edited.comune.trim())??null);
                console.log("comune:" + JSON.stringify(this.formImpianto.get('comune')?.value));
                if(this.formImpianto.get('comune')){
                  this.formImpianto.get('comune')?.enable({emitEvent:false});
                }
              }
            })}
            else{
              this.comuni$.subscribe({
                next:(com:CodiceDescrizioneBase[])=>{
                  if(com && com.length>0){
                    this.formImpianto.get('comune')?.enable({emitEvent:false});
                  }
                }
              })
            }}       
          });
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
    if(!this.flagModifica){
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
        indirizzo : this.formImpianto.get('indirizzo')?.value,
        civico : this.formImpianto.get('civico')?.value,
        cap : this.formImpianto.get('cap')?.value,
        statoImpianto : this.formImpianto.get('statoImpianto')?.value,
        attivo : this.formImpianto.get('attivo')?.value ?? "N",
        emailUtenteLoggato : this.utenteService.currentUser?.mail ?? ''
      });
      console.log("utente creatore: " + this.utenteService.currentUser?.mail);
      console.log(JSON.stringify(nuovoImpianto));

      this.impiantoService.createImpianto(nuovoImpianto).subscribe({
        next: (x: string) =>{   
          alert(x);
          this.router.navigate(['/impianto']);
        },
        error: (err)=>{
          alert("Errore durante la creazione dell'impianto. Riprova più tardi.");
        }
      });
    } else {
      const impiantoModificato : ImpiantoEdit = {
        idConfigurazione: Number(this.formImpianto.get('idConfigurazione')?.value),
        flagEsercizio: this.formImpianto.get('flagEsercizio')?.value,
        dataEntrataEsercizio: this.formImpianto.get('dataEntrataEsercizio')?.value,
        tipologiaImpianto: this.formImpianto.get('tipologiaImpianto')?.value,
        potenzaNominaleKw: this.formImpianto.get('potenzaNominaleKw')?.value,
        presenzaAccumulo: this.formImpianto.get('presenzaAccumulo')?.value,
        capacitaAccumuloKwh: this.formImpianto.get('capacitaAccumuloKwh')?.value,
        categoriaProduttore: this.formImpianto.get('categoriaProduttore')?.value,
        codiceCategoriaProduttore: this.formImpianto.get('codiceCategoriaProduttore')?.value,
        specificaTipologiaImpianto: this.formImpianto.get('specificaTipologiaImpianto')?.value,
        specificaCategoriaProduttore: this.formImpianto.get('specificaCategoriaProduttore')?.value,
        tipologiaSitoInstallazione: this.formImpianto.get('tipologiaSitoInstallazione')?.value,
        specificaSitoInstallazione: this.formImpianto.get('specificaSitoInstallazione')?.value,
        regione: this.formImpianto.get('regione')?.value,
        provincia: this.formImpianto.get('provincia')?.value,
        comune: this.formImpianto.get('comune')?.value,
        indirizzo: this.formImpianto.get('indirizzo')?.value,
        civico: this.formImpianto.get('civico')?.value,
        cap: this.formImpianto.get('cap')?.value,
        statoImpianto: this.formImpianto.get('statoImpianto')?.value,
        attivo: this.formImpianto.get('attivo')?.value,
        emailUtenteLoggato: this.utenteService.currentUser?.mail ?? '',
        specTipologia: this.formImpianto.get('specificaTipologiaImpianto')?.value,
        specCatProduttore: this.formImpianto.get('specificaCategoriaProduttore')?.value,
        tipologiaSitoInst: this.formImpianto.get('tipologiaSitoInstallazione')?.value,
        specSitoInst: this.formImpianto.get('specificaSitoInstallazione')?.value
      };
      console.log(JSON.stringify(impiantoModificato));
      this.impiantoService.editImpianto(this.idEdit!, impiantoModificato).subscribe({
        next: (x: string) => {
          console.log("modifica impianto con id: " + this.idEdit);
          this.router.navigate(['/impianto']);
        },
        error: (err) => {
          alert("Errore durante la modifica dell'impianto. Riprova più tardi.");
        }
      });
    }
  }

}
