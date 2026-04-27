import { ChangeDetectionStrategy, Component, EventEmitter, Output } from "@angular/core";
import { LoginService } from "../../services/login.service";
import { MatDialog } from '@angular/material/dialog';
import { DialogLogoutComponent } from "src/app/dialog-logout/dialog-logout.component";
import { Router } from "@angular/router";
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
    private router: Router,
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

  navigateTo(){
    this.router.navigateByUrl('userProfile');
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



