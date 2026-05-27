// services/territorio.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CodiceDescrizioneBase } from 'src/app/core/interfaces/territorio.model';
import { ApiService } from 'src/app/core/services/api.service';

@Injectable({ providedIn: 'root' })
export class TerritorioService {

 constructor(private api: ApiService) {}

  getRegioni(): Observable<CodiceDescrizioneBase[]> {
    return this.api.get<CodiceDescrizioneBase[]>('api/territorio/regioni');
  }

  getProvince(): Observable<CodiceDescrizioneBase[]> {
    return this.api.get<CodiceDescrizioneBase[]>('api/territorio/province');
  }

  getComuni(): Observable<CodiceDescrizioneBase[]> {
    return this.api.get<CodiceDescrizioneBase[]>('api/territorio/comuni');
  }
}
