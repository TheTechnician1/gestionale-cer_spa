import { ChangeDetectionStrategy, Component, EventEmitter, Output } from "@angular/core";
import { LoginService } from "../../services/login.service";
import { MatDialog } from '@angular/material/dialog';
import { DialogLogoutComponent } from "src/app/dialog-logout/dialog-logout.component";
import { NotificheService } from "../../services/notifiche.service";



@Component({
  selector: "app-header",
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.scss"],
  //standalone: true,
  //imports: [MatButtonModule, MatMenuModule, MatIconModule]
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent {
  @Output() toggleSidebar = new EventEmitter<void>();
  readonly notifiche$ = this.notificheService.notifiche$;

  constructor (
    private loginService: LoginService,
    public dialog: MatDialog,
    public notificheService: NotificheService
  ) {}

  logout(){
    this.loginService.logout();
  }

  // readonly menuTrigger = viewChild.required(MatMenuTrigger);

  

  // openDialog() {
  //   console.log("CARMELOOOOO");
    
  // }


  openDialog() {
    this.dialog.open(DialogLogoutComponent);
  }

  mostraNotifiche(): boolean {
    return this.notificheService.visibilePerUtenteCorrente();
  }

  segnaNotificheLette(): void {
    this.notificheService.segnaTutteComeLette();
  }

  svuotaNotifiche(): void {
    this.notificheService.svuota();
  }
}

// @Component({
//   selector: 'app-dialog-logout',
//   templateUrl: '../core/dialog-logout.component.html',
//   imports: [MatDialogContent, MatDialogActions, MatDialogClose, MatButtonModule],
//   changeDetection: ChangeDetectionStrategy.OnPush,
// })
// export class DialogFromMenuExampleDialog {}




