import { Component, OnInit } from "@angular/core";
import { FormBuilder, Validators } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";

@Component({
  selector: "app-config-modifica",
  templateUrl: "./config-modifica.component.html",
  styleUrls: ["./config-modifica.component.scss"],
})
export class ConfigModificaComponent implements OnInit {
  isDetail = false;
  form = this.fb.group({
    id_config: [null, [Validators.required]],
    id_cer: [null, [Validators.required]],
    codice_cabina: [null, [Validators.required]],
    anno_attivazione: [null, [Validators.required]],
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
