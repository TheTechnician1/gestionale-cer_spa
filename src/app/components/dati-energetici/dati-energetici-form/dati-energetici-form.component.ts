import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router, ActivatedRoute } from "@angular/router";
import { DatiEnergetici } from "src/app/core/interfaces/dati-energetici.model";
import { CerService } from "../../services/cer.service";
import { DatiEnergeticiService } from "../../services/dati-energetici.service";

@Component({
  selector: "app-dati-energetici-form",
  templateUrl: "./dati-energetici-form.component.html",
    styleUrls: ["./dati-energetici-form.component.scss"]
})
export class DatiEnergeticiFormComponent implements OnInit {

  form!: FormGroup;

  isEdit = false;
  idDati?: number;

  cerList = ["CER Milano", "CER Roma", "CER Torino"];

  private datiEnergetici: any[] = [];
  toastService: any;
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
     private cerService: CerService,
     private datiService: DatiEnergeticiService
  ) {}

  ngOnInit(): void {

    this.form = this.fb.group({
      idSchedaEnergetica:[''],
      idCer:[''],
      idConfigurazione:[''],
      annoRiferimento: [''],
      energiaProdottaMhw: [''],
      energiaCondivisaMhw:[''],
      energiaPrelevataMhw: [''],
      energiaImmessaMhw: [''],
      corrispettivoPremioEuro: [''],
      riduzioneCo2Ton: [''],
      energiaAutoconsumataMhw: [''],
      calcoloCo2Automatico: [''],
      attivo: [''],
      tariffaPremioEuro: [''],
      note: [""],
      emailUtenteLoggato: ['']
    });


    const id = this.route.snapshot.paramMap.get("id");
    if (id) {
      this.isEdit = true;
      this.idDati = +id;

     
  //    this.loadMockData(this.idDati);
    }
  

  // loadMockData(id: number): void {
  //   const mock: DatiEnergetici = {
  //     idDati: id,
  //     idCer: 1,
  //     idConfig: 1,
  //     anno: 2024,
  //     eProdotta: 100,
  //     ePrelevata: 50,
  //     eImmessa: 20,
  //     eCondivisa: 30,
  //     eAutoCons: 40,
  //     tariffaPremium: 10,
  //     corrPremioOtt: 0,
  //     ridEmCo2: "",
  //     calcoloCo2Automatic: 0,
  //     note: "mock",
  //     flgCancellazione: null
  //   };

  //   this.form.patchValue(mock);
  // }

}
save(): void {

  if (this.form.invalid) {
    this.form.markAllAsTouched();
    return;
  }

  // const payload = {
  //   ...this.form.value,
  //   idDati: this.idDati
  // };
  const v = this.form.value;

const payload = {
  ...v,

  idSchedaEnergetica: this.idDati,

  idCer: v.idCer ? Number(v.idCer) : null,

  energiaProdottaMhw: Number(v.energiaProdottaMhw) || 0,
  energiaPrelevataMhw: Number(v.energiaPrelevataMhw) || 0,
  energiaImmessaMhw: Number(v.energiaImmessaMhw) || 0,
  energiaCondivisaMhw: Number(v.energiaCondivisaMhw) || 0,
  energiaAutoconsumataMhw: Number(v.energiaAutoconsumataMhw) || 0,

  tariffaPremioEuro: Number(v.tariffaPremioEuro) || 0,

  calcoloCo2Automatico: v.calcoloCo2Automatico === true,

  riduzioneCo2Ton: v.riduzioneCo2Ton || null,

  note: v.note || null,
  attivo: v.attivo || "S"
};

  console.log("payload:", payload);

  const request$ = this.isEdit
    ? this.cerService.putCer(this.idDati!, payload)
    : this.datiService.createDatiEnergetici(payload);

  request$.subscribe({
    next: () => {
      // this.toastService.success('✅ Dati Energetici inseriti');
      console.log("SALVATO:", payload);
      
      this.router.navigate(['/dati-energetici']);
    },
    error: (err: any) => console.error(err)
  });

}

back(): void {
  this.router.navigate(["/dati-energetici"]);
}
}
