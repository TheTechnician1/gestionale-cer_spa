import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ComboTable } from 'src/app/core/enum/comboTable.enum';
import { CodiceDescrizioneBase } from 'src/app/core/interfaces/impianto.model';
import { ApiRequestOptions, ApiService } from 'src/app/core/services/api.service';

@Injectable({
  providedIn: 'root'
})
export class CodiciDescrizioneBaseService {

  constructor(private api: ApiService) {}

  getCodiceDescrizioneBase(table : ComboTable, parameter : string | null,  options: ApiRequestOptions = {}): Observable<CodiceDescrizioneBase[]> {
    const endpoint = `/codici/${table}`;
    return this.api.get<CodiceDescrizioneBase[]>(endpoint,parameter? {parameter : parameter} : undefined, options);
  }

}
