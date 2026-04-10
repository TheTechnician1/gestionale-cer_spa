import { Component, OnInit } from "@angular/core";
import { FormBuilder, Validators } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";

@Component({
  selector: "app-impianto-modifica",
  templateUrl: "./impianto-modifica.component.html",
  styleUrls: ["./impianto-modifica.component.scss"],
})
export class ImpiantoModificaComponent implements OnInit {
  isDetail = false;
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

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.isDetail = this.route.snapshot.data?.["mode"] === "detail";
    if (this.isDetail) {
      this.form.disable();
    }
  }
}
