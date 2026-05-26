import { NgModule } from "@angular/core";
import { SharedModule } from "src/app/shared/shared.module";
import { ImpiantoRoutingModule } from "./impianto-routing.module";
import { ImpiantiFormComponent } from "../../components/impianti/impianti-form/impianti-form.component";
import { ImpiantiRicercaComponent } from "../../components/impianti/impianti-ricerca/impianti-ricerca.component";

import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { ImpiantiViewComponent } from "src/app/components/impianti/impianti-view/impianti-view.component";

@NgModule({
  declarations: [ImpiantiRicercaComponent, ImpiantiFormComponent, ImpiantiViewComponent],
  schemas: [],
  exports: [],
  imports: [SharedModule, ImpiantoRoutingModule, MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSnackBarModule],
})
export class ImpiantoModule {}
