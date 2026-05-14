import { Component } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { ImpiantoModel } from "./core/interfaces/impianto.model";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
})
export class AppComponent {

  impianto: ImpiantoModel = new ImpiantoModel()
  constructor(private translate: TranslateService) {
    this.translate.setDefaultLang("en");
    this.translate.use("en");
  }
}
