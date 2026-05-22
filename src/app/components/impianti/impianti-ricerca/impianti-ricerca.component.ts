import { Component, ViewChild } from "@angular/core";
import { Router } from "@angular/router";
import { Observable, of } from "rxjs";
import { CodiceDescrizioneBase, CodiceDescrizioneBaseModel, Impianto, ImpiantoModel, ImpiantoView } from "src/app/core/interfaces/impianto.model";
import { CodiciDescrizioneBaseService } from "../../services/codici-descrizione-base.service";
import { FormBuilder, FormGroup } from "@angular/forms";
import { ComboTables } from "src/app/core/enum/comboTable.enum";
import { Cer, CerView } from "src/app/core/interfaces/cer.model";
import { ImpiantoService } from "../../services/impianto.service";
import { ConfirmationDialogComponent, DialogCloseReason } from "src/app/shared/components/confirmation-dialog/confirmation-dialog.component";
import { CerService } from "../../services/cer.service";
import { UtenteService } from "src/app/core/services/utente.service";

@Component({
  selector: "app-impianti-ricerca",
  templateUrl: "./impianti-ricerca.component.html",
  styleUrls: ["./impianti-ricerca.component.scss"],
})
export class ImpiantiRicercaComponent {
  @ViewChild("confirmationDialog") confirmationDialog!: ConfirmationDialogComponent;

  impiantiList : ImpiantoView[] = [];
  tipologieImpianto$? : Observable<CodiceDescrizioneBase[]>;
  statiImpianto$? : Observable<CodiceDescrizioneBase[]>;



  regioni$? : Observable<CodiceDescrizioneBase[]>;
  provincie$? : Observable<CodiceDescrizioneBase[]>;
  comuni$? : Observable<CodiceDescrizioneBase[]>;
  cer$? : Observable<CerView[]>;
  formRicercaImpianti : FormGroup;

  constructor(private codiciDescrizioneBaseService : CodiciDescrizioneBaseService,
    private impiantoService :ImpiantoService,
    private cerService : CerService,
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
        attivo : ['']
      });

  }

  ngOnInit(): void {
    //FORM OPZIONI CER
    this.cer$ = this.cerService.getCerMock();

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
      return of([]);
    }});

    this.impiantoService.getImpiantiMock().subscribe({
      next:(impianti)=>{
        this.impiantiList = impianti.filter(imp=> imp.attivo === 'S');
      } 
    })
  }


  ngAfterViewInit(): void {

  }

  search(): void {
    //   this.impiantoService.getImpiantiMock().subscribe({
    //     next:(impianti)=>{
    //     this.impiantiList = impianti.filter(imp=> imp.attivo === 'S'
    //       &&(this.formRicercaImpianti.get('cer')?.value === imp.id)

    //               cer : [''],
    //     cabina : [''],
    //     regione : [''],
    //     provincia : [''],
    //     comune : ['']
          
    //     );
    //   } 
    // })
  }

  inserisciDati(): void {
    this.router.navigate(['/impianto/form']);
  }

  salvataggio(){

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
        this.impiantoService.getImpiantiMock().subscribe({

        });
      }
    });
    this.impiantoService.getImpiantiMock().subscribe({
      next:(impianti)=>{
        this.impiantiList = impianti.filter(imp=> imp.attivo === 'S');
      } 
    })
  }
  
}
