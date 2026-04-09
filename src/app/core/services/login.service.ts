import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor() { }

  login(email:string, password:string){
    let isLoginOk = false;
    console.log("email = ", email);

    //qua dovrebbe poi chiamare endpoint. Ma per ora non lo fa... facciamo un controllo a secco

    if(email === "peppe@gmail.com"){
      return true
    }
    return false;
  }
}
