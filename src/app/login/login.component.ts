import { Component } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormsModule,
  FormControl,
  Validators,
  EmailValidator,
  PatternValidator,
  FormControlName,
} from '@angular/forms';
import { ControlloErroriService } from '../core/services/controllo-errori.service';
import { ReactiveFormsModule } from '@angular/forms';
import { Login, LoginService } from '../core/services/login.service';
import { HttpClient } from '@angular/common/http';
import { Route, Router } from '@angular/router';
import { AuthService, Role } from '../core/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  //imports: [ReactiveFormsModule],
})

// @NgModule({
//   imports: [ReactiveFormsModule],
// })
export class LoginComponent {
  form = this.fb.group({
    email: new FormControl('', [
      Validators.required,
      Validators.email,
      Validators.pattern(/^[^\s@]+@[^\s@]+\.[^\s@]+$/),
    ]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(8),
    ]),
  });
  hide = false;


  
  






  constructor(
    private controlloErroriService: ControlloErroriService,
    private fb: FormBuilder,
    private login: LoginService,
    private http: HttpClient,
    private router: Router,
    private auth: AuthService,
  ) {}

  get email(): any {
    return this.form.get('email');
  }

  get password(): any {
    return this.form.get('password');
  }

  user = {
    email: 'guest@guest.guest',
    password: 'guest',
  };

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    if (this.form.valid) {
      let email: string = this.email.value;
      let passw = this.password.value;
      this.login.login(email, passw);
      let response: Login = this.login.getL();

      if (response.isLoginOK === true) {
        //redirect
        console.log("TUTTO OK L'UTENZA ------------- " + response.ruolo);

        if(response.ruolo === Role.ADMIN.toUpperCase()){
          this.auth.loginAsAdmin();
          this.router.navigate(['']);
        }
        else if(response.ruolo === Role.GEST.toUpperCase()){
          this.auth.loginAsGest();
          this.router.navigate(['']);
        }else{
          this.auth.loginAsGuest();
          this.router.navigate(['']);
        }

      } else {
        //faccio altro...
        console.log("NON E' ok L'utenza");
      }
    }

    // JSON finale mappato
    const json = this.form.value;
    const jsonCreato = JSON.stringify(json, null, 2)
    console.log(jsonCreato);
    

    
    
 
  }

  submitOspite() {
    this.login.login(this.user.email, this.user.password);
    let response: Login = this.login.getL();
    if (response.isLoginOK === true) {
      console.log("TUTTO OK L'UTENZA ------------- " + response.ruolo);
      const json = this.user;
      console.log(JSON.stringify(json, null, 2));
      this.auth.loginAsGuest();
      this.router.navigate(['']);
    } else {
      //faccio altro...
      console.log("NON E' ok L'utenza");
    }
  }

  sendData() {
    // this.http.post('http://localhost:3000/api/endpoint', jsonCreato)
    // .subscribe(response => console.log(response));
  }

  getErrorMessageE() {
    if (this.email.hasError('required')) {
      return 'You must enter a value: Email is mandatory';
    }
    return this.email.hasError('email') ? 'Not a valid email: Try again' : '';
  }

  //Questo controllo non serve per il login, serve a Daniele per la registrazione
}
