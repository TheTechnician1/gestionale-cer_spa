import { Component } from '@angular/core';
import { LoginService } from '../core/services/login.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {

  constructor(private login : LoginService) { }

  ngOnInit(): void {
    if()
    this.login.getTabellaCER({}).subscribe({
      next: (res) => {
        console.log(res);
      }
    });
  }


}
