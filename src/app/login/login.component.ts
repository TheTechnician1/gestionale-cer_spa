import { Component, inject, Injectable } from '@angular/core';
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
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';
import { ApiService } from '../core/services/api.service';

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
  // id = 0

  // getid(){
  //   return this.id
  // }

  constructor(
    private controlloErroriService: ControlloErroriService,
    private fb: FormBuilder,
    private login: LoginService,
    private router: Router,
    private snackBar: MatSnackBar = inject(MatSnackBar),
    private apiService: ApiService,
  ) {}

  user = {
    email: 'guest@guest.guest',
    password: 'guest',
  };
  

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const payload = this.form.getRawValue();

    this.chiamataLogin(payload);
  }

  submitOspite() {
    this.chiamataLogin(this.user);
  }

  chiamataLogin(payload: any){
    this.login.login(payload).subscribe({
      next: (res) => {
        console.log(res);
        this.router.navigateByUrl('/');
      },
      error: (error) => {
        console.error("Login error", error);
        let verticalPosition: MatSnackBarVerticalPosition = 'bottom';
        let horizontalPosition: MatSnackBarHorizontalPosition = 'end';
        this.snackBar.open("Error: " + error.message, 'Undo', {
          duration: 3000,
          horizontalPosition: horizontalPosition,
          verticalPosition: verticalPosition,
        });
      },
    });
  }

  getErrorMessageE() {
    if (this.form.get('email')?.hasError('required')) {
      return 'You must enter a value: Email is mandatory';
    }
    return this.form.get('email')?.hasError('email') ? 'Not a valid email: Try again' : '';
  }

}
