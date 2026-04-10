import { AfterViewInit, Component, OnInit, ViewChild } from "@angular/core";
import { FormBuilder } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { MatTableDataSource } from "@angular/material/table";
import { CerCancellazioneComponent } from "../cer-cancellazione/cer-cancellazione.component";
import { AuthService } from "../../../core/services/auth.service";
import { MatPaginator } from "@angular/material/paginator";
import { Cer } from "../../../core/interfaces/cer.model";
import { CerService } from "../../../core/services/cer.service";
import { CER_HEADERS } from "./cer-gestione.headers";
import { CER_ACTIONS, CerRowAction } from "./cer-gestione.actions";

@Component({
  selector: "app-cer-gestione",
  templateUrl: "./cer-gestione.component.html",
  styleUrls: ["./cer-gestione.component.scss"],
})
export class CerGestioneComponent implements OnInit, AfterViewInit {
  form = this.fb.group({
    ragioneSociale: [null],
    codiceFiscale: [null],
    localizzazione: [null],
  });

  headers = CER_HEADERS;
  displayedColumns = this.headers.map((header) => header.key);
  rowActions = CER_ACTIONS;
  dataSource = new MatTableDataSource<Cer>([]);

  @ViewChild(MatPaginator) paginator?: MatPaginator;

  constructor(
    private fb: FormBuilder,
    private dialog: MatDialog,
    private authService: AuthService,
    private cerService: CerService,
  ) {}

  ngOnInit(): void {
    this.cerService.ricercaMock().subscribe((data) => {
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
    this.dialog.open(CerCancellazioneComponent, {
      width: "520px",
      panelClass: "app-delete-dialog",
      data: {
        title: "Cancellazione CER",
        message: "Questa operazione disattiva la CER.",
      },
    });
  }

  getStato(row: Cer): string {
    return row.flg_cancellazione === "S" ? "Cancellata" : "Attiva";
  }

  handleRowAction(action: CerRowAction, row: Cer): void {
    switch (action) {
      case "detail":
        console.log("Dettaglio CER", row);
        break;
      case "edit":
        console.log("Modifica CER", row);
        break;
      case "delete":
        this.openDeleteDialog();
        break;
      default:
        break;
    }
  }
}
