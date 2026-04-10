import { Component } from "@angular/core";
import { FormBuilder, Validators } from "@angular/forms";
import { RegexEnum } from "../../../core/util/regex.enum";

@Component({
  selector: "app-cer-inserimento",
  templateUrl: "./cer-inserimento.component.html",
  styleUrls: ["./cer-inserimento.component.scss"],
})
export class CerInserimentoComponent {
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

  constructor(private fb: FormBuilder) {}
}
