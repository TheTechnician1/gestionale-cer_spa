import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router, ActivatedRoute } from "@angular/router";
import { DatiEnergetici } from "src/app/core/interfaces/dati-energetici.model";
import { CerService } from "../../services/cer.service";

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
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
     private cerService: CerService 
  ) {}

  ngOnInit(): void {

    this.form = this.fb.group({
      idCer: [null, Validators.required],
      anno: [new Date().getFullYear(), Validators.required],
      eProdotta: [0, Validators.required],
      ePrelevata: [0],
      eImmessa: [0],
      eCondivisa: [0],
      eAutoCons: [0],
      tariffaPremium: [0],
      note: [""]
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

  const payload = {
    ...this.form.value,
    idDati: this.idDati 
  };

  console.log("paylod:"+payload);
  

  const request$ = this.isEdit
    ? this.cerService.putCer(this.idDati!, payload)
    : this.cerService.getCerRicerca();

  request$.subscribe({
    next: () => {
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
