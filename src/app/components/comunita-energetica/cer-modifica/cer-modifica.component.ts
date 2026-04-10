import { Component, OnInit } from "@angular/core";
import { FormBuilder, Validators } from "@angular/forms";
import { RegexEnum } from "../../../core/util/regex.enum";
import { ActivatedRoute } from "@angular/router";

@Component({
  selector: "app-cer-modifica",
  templateUrl: "./cer-modifica.component.html",
  styleUrls: ["./cer-modifica.component.scss"],
})
export class CerModificaComponent implements OnInit {
  isDetail = false;
  form = this.fb.group({
    id_cer: [null, [Validators.required]],
    rag_sociale: [null, [Validators.required]],
    cod_fisc: [null, [Validators.required, Validators.pattern(new RegExp(RegexEnum.CODICE_FISCALE, "i"))]],
    partita_iva: [null],
    comune_legale: [null, [Validators.required]],
    provincia_legale: [null, [Validators.required]],
    regione_legale: [null, [Validators.required]],
    forma_giuridica: [null, [Validators.required]],
    telefono: [null, [Validators.pattern(new RegExp(RegexEnum.PHONE))]],
    e_mail: [null, [Validators.required, Validators.email]],
    pec: [null, [Validators.required, Validators.email]],
    sito_web: [null],
    referente: [null, [Validators.required]],
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
