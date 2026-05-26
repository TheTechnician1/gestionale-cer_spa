import { Component, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { ConfirmationDialogComponent, DialogCloseReason } from
"src/app/shared/components/confirmation-dialog/confirmation-dialog.component";

import { CerService } from "../../services/cer.service";
import { DatiEnergeticiService } from "../../services/dati-energetici.service";

import { CerModel, CerView } from "src/app/core/interfaces/cer.model";
import { DatiEnergetici } from "src/app/core/interfaces/dati-energetici.model";

import { MatTableDataSource } from "@angular/material/table";
import { debounceTime, distinctUntilChanged, map, Observable, of, switchMap, tap } from "rxjs";
import { ConfigurazioneView } from "src/app/core/interfaces/configurazione.model";
import { ConfigurazioniService } from "../../services/configurazioni.service";
import { DatiEnergeticiView } from "src/app/core/interfaces/dati-energetici-view";

@Component({
  selector: "app-dati-energetici-ricerca",
  templateUrl: "./dati-energetici-ricerca.component.html",
  styleUrls: ["./dati-energetici-ricerca.component.scss"],
})
export class DatiEnergeticiRicercaComponent implements OnInit {

  @ViewChild("confirmationDialog") confirmationDialog!: ConfirmationDialogComponent;


  formRicerca!: FormGroup;

  cerList$?: Observable<CerView[]>;
  configurazioniList$? : Observable<ConfigurazioneView[]>;
  datiEnergetici$? : Observable<DatiEnergeticiView[]>;

  cabinaList: any[] = [];
  anniList: number[] = [];



  constructor(
    private fb: FormBuilder,
    private cerService: CerService,
    private configurazioniService : ConfigurazioniService,
    private datiEnergeticiService: DatiEnergeticiService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.initAnni();
    this.cerList$ = this.cerService.getAllCer();
    this.formRicerca.get("idCer")?.valueChanges.subscribe(idCer => {
      this.configurazioniList$=of([]);
      this.formRicerca.get("idCabina")?.setValue(null);
      this.formRicerca.get("idCabina")?.disable({emitEvent:false});

      if (idCer) {
        this.configurazioniList$ = this.configurazioniService
          .getAllConfigurazione()
          .pipe(
            map(imp =>imp.filter(i=> i.idCer===idCer)),
            tap(x=> x.forEach(y=>console.log("cabina:"+ y.codiceCabina)))
          );
        this.configurazioniList$.subscribe({
          next : (x)=>{
            if(x && x.length>0){
              this.formRicerca.get("idCabina")?.enable({emitEvent:false});
            }
          }
        });
      }else{
        this.configurazioniList$=of([]);
      }
    });

    
  this.formRicerca.valueChanges
  .pipe(
    debounceTime(500),
    distinctUntilChanged()
  )
  .subscribe(res => {
    this.search();
  });

  }

  private initForm(): void {
    const currentYear = new Date().getFullYear();

    this.formRicerca = this.fb.group({
      annoRiferimento: [''],
      idCer:[''],
      idCabina: [{value :'', disabled : true }],
      partitaIva: [''],
      codiceCabina: [''],
      attivo: [{value :'', disabled : true }],
    
    });

  }

  private initAnni(): void {
    const currentYear = new Date().getFullYear();

    this.anniList = Array.from(
      { length: currentYear - 1899 },
      (_, i) => currentYear - i
    );
  }

  private loadCer(): void {
    this.cerService.getCerRicerca();
  }


 search(): void {

  
    let filter : Record<string, string | number | boolean>[] = [];
    filter = [
      this.formRicerca.get('annoRiferimento')?.value ? { annoRiferimento: this.formRicerca.get('annoRiferimento')?.value } : {},
      this.formRicerca.get('idCer')?.value ? { idCer: this.formRicerca.get('idCer')?.value } : {},
      this.formRicerca.get('idCabina')?.value ? { idCabina: this.formRicerca.get('idCabina')?.value } : {},
      this.formRicerca.get('partitaIva')?.value ? { partitaIva: this.formRicerca.get('partitaIva')?.value } : {},
      this.formRicerca.get('codiceCabina')?.value ? { codiceCabina: this.formRicerca.get('codiceCabina')?.value } : {},
      this.formRicerca.get('attivo')?.value ? { attivo: this.formRicerca.get('attivo')?.value } : {attivo: "N"}
    
    ];

    this.datiEnergetici$ = this.datiEnergeticiService.getDatiFilter(filter);
  }

  // inserisciDati(): void {
  //   this.router.navigate(["/dati-energetici/form"]);
  // }

  visualizzaDato(id: number | null): void {
    if (!id) return;
    this.router.navigate(["/dati-energetici/view", id]);
  }

  modificaDati(id: number | null): void {
    if (!id) return;
    this.router.navigate(["/dati-energetici/edit", id]);
  }

eliminaDati(dato: any): void {

    console.log("PEPPINO COMPLETO", dato);
  console.log("PEPPINO IMP", dato.payload?.idSchedaEnergetica);

  this.datiEnergetici$ = this.datiEnergetici$?.pipe(

    map(lista =>
      lista.filter(
        d => d.idSchedaEnergetica !== dato.payload?.idSchedaEnergetica
        )
    )

  );

}

openDialog(dato: DatiEnergetici): void {
    this.confirmationDialog.open({
      payload: dato,
    });
  }

  onCancel(event: any): void {
  console.log("Dialog annullato", event);
}

onClosed(reason: DialogCloseReason): void {
  console.log("Dialog chiuso:", reason);
}
}