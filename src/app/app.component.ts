import { Component } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { VisualTranslationService } from "./core/services/visual-translation.service";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
})
export class AppComponent {
  constructor(
    private translate: TranslateService,
    private visualTranslation: VisualTranslationService
  ) {
    const linguaSalvata = localStorage.getItem("lingua") || "it";

    this.translate.setDefaultLang("it");
    this.translate.use(linguaSalvata);
    this.visualTranslation.start();
  }
}
