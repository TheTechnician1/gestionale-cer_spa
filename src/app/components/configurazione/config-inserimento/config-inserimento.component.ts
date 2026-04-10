import { Component } from "@angular/core";
import { FormBuilder, Validators } from "@angular/forms";

@Component({
  selector: "app-config-inserimento",
  templateUrl: "./config-inserimento.component.html",
  styleUrls: ["./config-inserimento.component.scss"],
})
export class ConfigInserimentoComponent {
  form = this.fb.group({
    id_config: [null, [Validators.required]],
    id_cer: [null, [Validators.required]],
    codice_cabina: [null, [Validators.required]],
    anno_attivazione: [null, [Validators.required]],
    flg_cancellazione: ["N"],
  });

  constructor(private fb: FormBuilder) {}
}
