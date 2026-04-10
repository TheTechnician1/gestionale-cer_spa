import { AfterViewInit, Component, OnInit, ViewChild } from "@angular/core";
import { FormBuilder } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { MatTableDataSource } from "@angular/material/table";
import { ConfigCancellazioneComponent } from "../config-cancellazione/config-cancellazione.component";
import { AuthService } from "../../../core/services/auth.service";
import { MatPaginator } from "@angular/material/paginator";
import { ConfigurazioneCabinaPrimaria } from "src/app/core/interfaces/configurazione-cabina-primaria.model";
import { ConfigurazioneService } from "../../../core/services/configurazione.service";
import { CONFIG_HEADERS } from "./config-gestione.headers";
import { CONFIG_ACTIONS, ConfigRowAction } from "./config-gestione.actions";

@Component({
  selector: "app-config-gestione",
  templateUrl: "./config-gestione.component.html",
  styleUrls: ["./config-gestione.component.scss"],
})
export class ConfigGestioneComponent implements OnInit, AfterViewInit {
  form = this.fb.group({
    idCer: [null],
    codiceCabina: [null],
    anno: [null],
  });

  headers = CONFIG_HEADERS;
  displayedColumns = this.headers.map((header) => header.key);
  rowActions = CONFIG_ACTIONS;
  dataSource = new MatTableDataSource<ConfigurazioneCabinaPrimaria>([]);

  @ViewChild(MatPaginator) paginator?: MatPaginator;

  constructor(
    private fb: FormBuilder,
    private dialog: MatDialog,
    private authService: AuthService,
    private configurazioneService: ConfigurazioneService,
  ) {}

  ngOnInit(): void {
    this.configurazioneService.ricercaMock().subscribe((data) => {
      this.dataSource.data = data;
    });
  }

  ngAfterViewInit(): void {
    if (this.paginator) {
      this.dataSource.paginator = this.paginator;
    }
  }

  get canEdit(): boolean {
    const ruolo = this.authService.currentUser?.ruolo;
    return ruolo === "ADMIN" || ruolo === "GEST";
  }

  openDeleteDialog(): void {
    this.dialog.open(ConfigCancellazioneComponent, {
      width: "520px",
      panelClass: "app-delete-dialog",
      data: {
        title: "Cancellazione Configurazione",
        message: "La configurazione verrà disattivata (soft delete).",
      },
    });
  }

  getStato(row: ConfigurazioneCabinaPrimaria): string {
    return row.flg_cancellazione === "S" ? "Cancellata" : "Attiva";
  }

  handleRowAction(action: ConfigRowAction, row: ConfigurazioneCabinaPrimaria): void {
    switch (action) {
      case "detail":
        console.log("Dettaglio Configurazione", row);
        break;
      case "edit":
        console.log("Modifica Configurazione", row);
        break;
      case "delete":
        this.openDeleteDialog();
        break;
      default:
        break;
    }
  }
}
