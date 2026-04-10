import { APP_INITIALIZER, NgModule } from "@angular/core";
import { HttpClient } from "@angular/common/http";

import { TranslateLoader, TranslateModule, TranslateService } from "@ngx-translate/core";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";
import { lastValueFrom } from "rxjs";

export function HttpLoaderFactory(http: HttpClient): TranslateHttpLoader {
  return new TranslateHttpLoader(http);
}

export function initTranslations(translate: TranslateService): () => Promise<void> {
  return async () => {
    translate.setDefaultLang("it");
    await lastValueFrom(translate.use("it"));
  };
}

@NgModule({
  imports: [
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      },
      defaultLanguage: "it",
    }),
  ],
  providers: [
    {
      provide: APP_INITIALIZER,
      useFactory: initTranslations,
      deps: [TranslateService],
      multi: true,
    },
  ],
  exports: [TranslateModule],
})
export class TranslateRootModule {}
