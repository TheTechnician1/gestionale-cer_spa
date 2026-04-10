import { AfterViewInit, Component, OnInit, ViewChild } from "@angular/core";
import { FormBuilder } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { MatTableDataSource } from "@angular/material/table";
import { ImpiantoCancellazioneComponent } from "../impianto-cancellazione/impianto-cancellazione.component";
import { AuthService } from "../../../core/services/auth.service";
import { MatPaginator } from "@angular/material/paginator";
import { Impianto } from "../../../core/interfaces/impianto.model";
import { ImpiantoService } from "../../../core/services/impianto.service";
import { IMPIANTO_HEADERS } from "./impianto-gestione.headers";
import { IMPIANTO_ACTIONS, ImpiantoRowAction } from "./impianto-gestione.actions";

@Component({
  selector: "app-impianto-gestione",
  templateUrl: "./impianto-gestione.component.html",
  styleUrls: ["./impianto-gestione.component.scss"],
})
export class ImpiantoGestioneComponent implements OnInit, AfterViewInit {
  form = this.fb.group({
    tipologia: [null],
    localizzazione: [null],
    cer: [null],
  });

  headers = IMPIANTO_HEADERS;
  displayedColumns = this.headers.map((header) => header.key);
  rowActions = IMPIANTO_ACTIONS;
  dataSource = new MatTableDataSource<Impianto>([]);

  @ViewChild(MatPaginator) paginator?: MatPaginator;

  constructor(
    private fb: FormBuilder,
    private dialog: MatDialog,
    private authService: AuthService,
    private impiantoService: ImpiantoService,
  ) {}

  ngOnInit(): void {
    this.impiantoService.ricercaMock().subscribe((data) => {
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
    this.dialog.open(ImpiantoCancellazioneComponent, {
      width: "520px",
      panelClass: "app-delete-dialog",
      data: {
        title: "Cancellazione Impianto",
        message: "L'impianto verrà disattivato.",
      },
    });
  }

  getStato(row: Impianto): string {
    return row.flg_cancellazione === "S" ? "Cancellato" : "Attivo";
  }

  handleRowAction(action: ImpiantoRowAction, row: Impianto): void {
    switch (action) {
      case "detail":
        console.log("Dettaglio Impianto", row);
        break;
      case "edit":
        console.log("Modifica Impianto", row);
        break;
      case "delete":
        this.openDeleteDialog();
        break;
      default:
        break;
    }
  }
}
