import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { HttpClientModule } from "@angular/common/http";
import { TranslateModule } from "@ngx-translate/core";

import { MatButtonModule } from "@angular/material/button";
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatIconModule } from "@angular/material/icon";
import { MatSidenavModule } from "@angular/material/sidenav";
import { MatListModule } from "@angular/material/list";
import { MatCardModule } from "@angular/material/card";
import { MatInputModule } from "@angular/material/input";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatTableModule } from "@angular/material/table";
import { MatPaginatorModule } from "@angular/material/paginator";
import { MatSortModule } from "@angular/material/sort";
import { MatDialogModule } from "@angular/material/dialog";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { MatMenuModule } from "@angular/material/menu";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatSelectModule } from "@angular/material/select";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatNativeDateModule } from "@angular/material/core";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatTabsModule } from "@angular/material/tabs";
import { MatTreeModule } from "@angular/material/tree";
import { MatGridListModule } from "@angular/material/grid-list";
import { MatBadgeModule } from "@angular/material/badge";
import { MatButtonToggleModule } from "@angular/material/button-toggle";
import { FormControlErrorComponent } from "./components/form-control-error/form-control-error.component";
import { ConfirmationDialogComponent } from "./components/confirmation-dialog/confirmation-dialog.component";
import { ToastSnackbarComponent } from "./components/toast-snackbar/toast-snackbar.component";
import { DonutChartComponent } from './components/donut-chart/donut-chart.component';
import { NgApexchartsModule } from "ng-apexcharts";
import { LineChartComponent } from './components/line-chart/line-chart.component';

export const MATERIAL_MODULES = [
  MatButtonModule,
  MatToolbarModule,
  MatIconModule,
  MatSidenavModule,
  MatListModule,
  MatCardModule,
  MatInputModule,
  MatFormFieldModule,
  MatTableModule,
  MatPaginatorModule,
  MatSortModule,
  MatDialogModule,
  MatSnackBarModule,
  MatMenuModule,
  MatCheckboxModule,
  MatSelectModule,
  MatDatepickerModule,
  MatNativeDateModule,
  MatProgressSpinnerModule,
  MatTabsModule,
  MatTreeModule,
  MatGridListModule,
  MatBadgeModule,
  MatButtonToggleModule,
  NgApexchartsModule
];

@NgModule({
  declarations: [FormControlErrorComponent, ConfirmationDialogComponent, ToastSnackbarComponent, DonutChartComponent, LineChartComponent],
  imports: [CommonModule, FormsModule, ReactiveFormsModule, HttpClientModule, TranslateModule, ...MATERIAL_MODULES],
  exports: [CommonModule, FormsModule, ReactiveFormsModule, HttpClientModule, TranslateModule, FormControlErrorComponent, ConfirmationDialogComponent, ToastSnackbarComponent, ...MATERIAL_MODULES, DonutChartComponent, LineChartComponent, NgApexchartsModule],
})
export class SharedModule {}
