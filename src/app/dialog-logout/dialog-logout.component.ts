
import {MatDialog, MatDialogRef} from '@angular/material/dialog';
import { ChangeDetectionStrategy, Component, inject, } from '@angular/core';
import { LoginService } from '../core/services/login.service';

@Component({
  selector: 'app-dialog-logout',
  templateUrl: './dialog-logout.component.html',
  styleUrls: ['./dialog-logout.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DialogLogoutComponent {
  constructor(private loginService: LoginService, public dialogRef: MatDialogRef<DialogLogoutComponent>,){
    
  }
  

  launchEventLogout(){
    this.loginService.logout();
    this.dialogRef.close();
    
  }
}
