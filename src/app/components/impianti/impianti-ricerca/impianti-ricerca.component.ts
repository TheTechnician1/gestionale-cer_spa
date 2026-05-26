import { AfterViewInit, Component, OnInit, ViewChild } from "@angular/core";
import { Router } from "@angular/router";
import { delay, map, Observable, of, switchMap, tap } from "rxjs";
import { CodiceDescrizioneBase, CodiceDescrizioneBaseModel, Impianto, ImpiantoModel, ImpiantoSearchFilterModel, ImpiantoView } from "src/app/core/interfaces/impianto.model";
import { CodiciDescrizioneBaseService } from "../../services/codici-descrizione-base.service";
import { FormBuilder, FormGroup } from "@angular/forms";
import { ComboTables } from "src/app/core/enum/comboTable.enum";
import { Cer, CerView } from "src/app/core/interfaces/cer.model";
import { ImpiantoService } from "../../services/impianto.service";
import { ConfirmationDialogComponent, DialogCloseReason } from "src/app/shared/components/confirmation-dialog/confirmation-dialog.component";
import { CerService } from "../../services/cer.service";
import { UtenteService } from "src/app/core/services/utente.service";
import { ConfigurazioneView } from "src/app/core/interfaces/configurazione.model";
import { ConfigurazioniService } from "../../services/configurazioni.service";
import { MatPaginator } from "@angular/material/paginator";
import { MatTableDataSource } from "@angular/material/table";

@Component({
  selector: "app-impianti-ricerca",
  templateUrl: "./impianti-ricerca.component.html",
  styleUrls: ["./impianti-ricerca.component.scss"],
})
export class ImpiantiRicercaComponent implements OnInit, AfterViewInit {
  @ViewChild("confirmationDialog") confirmationDialog!: ConfirmationDialogComponent;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  dataSource = new MatTableDataSource<ImpiantoView>;
  displayedColumns: string[] = [
    'codiceCabina',
    'statoImpianto',
    'tipologia',
    'potenzaNominaleKw',
    'regione',
    'attivo',
    'azioni'
  ];


  impiantiList$ : Observable<ImpiantoView[]> = of([]);
  tipologieImpianto$? : Observable<CodiceDescrizioneBase[]>;
  statiImpianto$? : Observable<CodiceDescrizioneBase[]>;

  regioni$? : Observable<CodiceDescrizioneBase[]>;
  provincie$? : Observable<CodiceDescrizioneBase[]>;
  comuni$? : Observable<CodiceDescrizioneBase[]>;
  cer$? : Observable<CerView[]>;
  configurazioni$? : Observable<ConfigurazioneView[]>;
  formRicercaImpianti : FormGroup;

  constructor(private codiciDescrizioneBaseService : CodiciDescrizioneBaseService,
    private impiantoService :ImpiantoService,
    private cerService : CerService,
    private configurazioneService : ConfigurazioniService,
    private utenteService : UtenteService,
    private fb : FormBuilder,
    private router : Router){

      this.formRicercaImpianti = this.fb.group({
        idConfigurazione : [''],
        idCer : [''],
        codiceCabina : [''],
        tipologiaImpianto : [''],
        statoImpianto : [''],
        regione : [''],
        provincia : [''],
        comune : [''],
        potenzaNominaleKw : [''],
        presenzaAccumulo : [''],
        attivo : [{value:'', disabled : true}]
      });

  }

  ngOnInit(): void {
    //ABILITAZIONE CAMPO ATTIVO SOLO PER ADMIN
    console.log("Role:" + this.utenteService.getRole());
    
    this.utenteService.getRole()=== "ADMIN" ? this.formRicercaImpianti.get('attivo')?.enable() : this.formRicercaImpianti.get('attivo')?.disable();

    //FORM OPZIONI CER
    this.cer$ = this.cerService.getAllCer();
    //FORM CONFIGURAZIONI
    this.configurazioni$ = this.configurazioneService.getAllConfigurazione();

    //FORM OPZIONI TIPOLOGIA IMPIANTO
    this.tipologieImpianto$ = this.codiciDescrizioneBaseService.getCodiceDescrizioneBase(ComboTables.TIPOLOGIA, "");
    //FORM OPZIONI STATO IMPIANTO
    this.statiImpianto$ = this.codiciDescrizioneBaseService.getCodiceDescrizioneBase(ComboTables.STATO, "");

    //FORM OPZIONI REGIONE
    this.regioni$ = this.codiciDescrizioneBaseService.getCodiceDescrizioneBase(ComboTables.REGIONI, "");
    //FORM OPZIONI PROVINCIA
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
      }});
    //FORM OPZIONI COMUNE
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
    }});

    //RECUPERO IMPIANTI
    this.loadData();
  }


  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  loadData(): void {
    this.impiantoService.getAllImpianti().subscribe(impianti => {
      const filtrati = impianti.filter(i => i.attivo === 'N');
      this.dataSource.data = filtrati;
    });
  }

  search() {
    //RECUPERO IMPIANTI
    console.log("ricerca");
    
    let filter : Record<string, string | number | boolean>[] = [];
    filter = [
      this.formRicercaImpianti.get('idImpianto')?.value ? { idImpianto: this.formRicercaImpianti.get('idImpianto')?.value } : {},
      this.formRicercaImpianti.get('idConfigurazione')?.value  ? { idConfigurazione: this.formRicercaImpianti.get('idConfigurazione')?.value } : {},
      this.formRicercaImpianti.get('idCer')?.value  ? { idCer: this.formRicercaImpianti.get('idCer')?.value } : {},
      this.formRicercaImpianti.get('codiceCabina')?.value ? { codiceCabina: this.formRicercaImpianti.get('codiceCabina')?.value } : {},
      this.formRicercaImpianti.get('tipologiaImpianto')?.value ? { tipologiaImpianto: this.formRicercaImpianti.get('tipologiaImpianto')?.value } : {},
      this.formRicercaImpianti.get('statoImpianto')?.value ? { statoImpianto: this.formRicercaImpianti.get('statoImpianto')?.value } : {},
      this.formRicercaImpianti.get('regione')?.value ? { regione: this.formRicercaImpianti.get('regione')?.value } : {},
      this.formRicercaImpianti.get('provincia')?.value ? { provincia: this.formRicercaImpianti.get('provincia')?.value } : {},
      this.formRicercaImpianti.get('comune')?.value ? { comune: this.formRicercaImpianti.get('comune')?.value } : {},
      this.formRicercaImpianti.get('potenzaNominaleKw')?.value ? { potenzaNominaleKw: this.formRicercaImpianti.get('potenzaNominaleKw')?.value } : {},
      this.formRicercaImpianti.get('presenzaAccumulo')?.value ? { presenzaAccumulo: this.formRicercaImpianti.get('presenzaAccumulo')?.value } : {},
      this.formRicercaImpianti.get('attivo')?.value ? { attivo: this.formRicercaImpianti.get('attivo')?.value } : {attivo: "N"}
    ];

    this.impiantoService.getImpiantiFilter(filter).subscribe(impianti => {
      this.dataSource.data = impianti;
    });
  }

  inserisciDati(): void {
    this.router.navigate(['/impianto/form']);
  }

  editaDati(id: number): void {
    this.router.navigate([`/impianto/edit/${id}`]);
  }

  visualizzaDati(id: number): void {
    this.router.navigate([`/impianto/view/${id}`]);
  }

  idImpiantoCancellato? : number;
  openDialog(id: number): void {
    this.idImpiantoCancellato = id;
    this.confirmationDialog.open({
      payload: undefined
    });
  }

  onCancel(): void {
    console.log("Annullato");
  }

  onClosed(reason: DialogCloseReason): void {
    console.log("Chiuso:", reason);
  }

  eliminaDato(){
    console.log("id cancellato :" + this.idImpiantoCancellato);
    this.impiantoService.deleteImpianto(this.idImpiantoCancellato, this.utenteService.currentUser?.mail ?? '').subscribe({
      next:(x)=>{
        console.log("Impianto eliminato con successo");
        this.search();
      },
      error:(err)=>{
        alert("Errore nell'eliminazione dell'impianto");
      }
    });
    this.search();
  }
  
}
