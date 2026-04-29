import { Component, OnInit, TemplateRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { LoginService } from '../core/services/login.service';
import { GetListaCER, ImpiantoCER, UserTest } from '../core/interfaces/user.model';

@Component({
  selector: 'app-profilo-utente',
  templateUrl: './profilo-utente.component.html',
  styleUrls: ['./profilo-utente.component.scss']
})
export class ProfiloUtenteComponent {


  raw: any
  obj: any
  user?: UserTest
  

  constructor (private login: LoginService) {

  }



  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.raw = this.login.getLocalStorage()
    this.obj = JSON.parse(this.raw)
    console.log(this.obj),
    console.log(this.obj.email)
    let email: string = this.obj.email
    this.login.visualizzaUtente(email).subscribe({
      next: (res) => {
        console.log(res)
        console.log(email)
        this.user = res
      },
      error: (err) =>{

      }
    })
  }

  

}
