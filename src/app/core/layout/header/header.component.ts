import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, inject, ViewChild } from "@angular/core";
import { LoginService } from "../../services/login.service";
import {MatIconModule} from '@angular/material/icon';
import {MatMenuModule, MatMenuTrigger} from '@angular/material/menu';
import {MatButtonModule} from '@angular/material/button';
import {
  MatDialog,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
} from '@angular/material/dialog';
import { DialogLogoutComponent } from "src/app/dialog-logout/dialog-logout.component";
import { Route, Router } from "@angular/router";



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

  constructor (private loginService: LoginService, public dialog: MatDialog, private router: Router) {}

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


}

// @Component({
//   selector: 'app-dialog-logout',
//   templateUrl: '../core/dialog-logout.component.html',
//   imports: [MatDialogContent, MatDialogActions, MatDialogClose, MatButtonModule],
//   changeDetection: ChangeDetectionStrategy.OnPush,
// })
// export class DialogFromMenuExampleDialog {}




