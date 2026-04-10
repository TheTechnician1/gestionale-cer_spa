import { Component } from "@angular/core";
import { FormBuilder, Validators } from "@angular/forms";

@Component({
  selector: "app-impianto-inserimento",
  templateUrl: "./impianto-inserimento.component.html",
  styleUrls: ["./impianto-inserimento.component.scss"],
})
export class ImpiantoInserimentoComponent {
  form = this.fb.group({
    id_impianto: [null, [Validators.required]],
    id_configurazione: [null, [Validators.required]],
    flg_esercizio: [null, [Validators.required]],
    data_eserc: [null, [Validators.required]],
    cod_tipologia: [null, [Validators.required]],
    pre_nom: [null, [Validators.required]],
    flg_accumulo: [null, [Validators.required]],
    cap_accumulo: [null, [Validators.required]],
    tipo_produttore: [null, [Validators.required]],
    cod_cat_prod: [null, [Validators.required]],
    flg_cancellazione: ["N"],
  });

  constructor(private fb: FormBuilder) {}
}
