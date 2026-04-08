import { Injectable } from '@angular/core';
import { CER } from '../interfaces/cer.model';

@Injectable({
  providedIn: 'root'
})
export class CERService {

  constructor() { }

  cer?: CER;

  getCER() {

  }
}
