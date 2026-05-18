import { NgModule } from "@angular/core";
import { SharedModule } from "src/app/shared/shared.module";
import { DatiEnergeticiRoutingModule } from "./dati-energetici-routing.module";
import { DatiEnergeticiFormComponent } from "src/app/components/dati-energetici/dati-energetici-form/dati-energetici-form.component";
import { DatiEnergeticiRicercaComponent } from "src/app/components/dati-energetici/dati-energetici-ricerca/dati-energetici-ricerca.component";
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBarModule } from '@angular/material/snack-bar';

@NgModule({
  declarations: [DatiEnergeticiRicercaComponent, DatiEnergeticiFormComponent],
  schemas: [],
  exports: [],
  imports: [SharedModule, DatiEnergeticiRoutingModule, MatCardModule,
MatFormFieldModule,
MatInputModule,
MatButtonModule,
  MatSnackBarModule],
})
export class DatiEnergeticiModule {}
