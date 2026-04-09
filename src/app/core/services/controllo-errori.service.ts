import { Injectable } from "@angular/core";
import { LoginComponent } from "src/app/login/login.component";

@Injectable({
  providedIn: "root",
})
export class ControlloErroriService {
  constructor() {}

  //Questo metodo va usato con pattern regex per il controllo delle stringhe ed è comodo per Daniele per la registrazione, più che per il login

  // getErrorMessagePassword() {
  //   let x
  //   if (this.loginComponent.password.length < 8) {
  //     return 'You must enter a string > 8 ';
  //   }
  //   for(let p of this.loginComponent.password){
  //     if(p === ''){
  //       x = 5
  //     }
  //     return x
  //   }

  //   return

  //   //return this.password.hasError('password') ? 'Not a valid email' : '';
  // }
}
