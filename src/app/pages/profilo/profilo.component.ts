import { Component, OnInit } from '@angular/core';

import { UserResponse } from '../../models/user-response';
import { UtenteStorageService } from '../../services/utente-storage.service';

@Component({
  selector: 'app-profilo',
  templateUrl: './profilo.component.html',
  styleUrls: ['./profilo.component.scss'],
})
export class ProfiloComponent implements OnInit {
  utente: UserResponse | null = null;

  constructor(private utenteStorageService: UtenteStorageService) {}

  ngOnInit(): void {
    this.utente = this.utenteStorageService.recuperaUtente();
  }
}