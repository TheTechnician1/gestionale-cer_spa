import { Injectable } from '@angular/core';
import {
  DatiEnergetici,
  DatiEnergeticiModel,
  DatiVisualizzaDto,
  VistaDatiEnergeticiDto,
} from '../../core/interfaces/dati-energetici.model';
import { ApiRequestOptions, ApiService } from '../../core/services/api.service';
import { Observable, map, of } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { UtenteService } from 'src/app/core/services/utente.service';

@Injectable({
  providedIn: 'root',
})
export class DatiEnergeticiService {
  private readonly basePath = 'api/dati-energetici';

  public USE_MOCK_DATA = false;

  private mockDatabase: DatiEnergetici[] = [];

  constructor(
    private http: HttpClient,
    private api: ApiService,
    private utenteService: UtenteService,
  ) {
    this.initializeMockDatabase();
  }

  /**
   * GET /api/dati-energetici
   */
  getDati(
    payload: any,
    options: ApiRequestOptions = {},
  ): Observable<DatiEnergetici[]> {
    if (this.USE_MOCK_DATA) {
      console.warn('⚠️ DatiEnergeticiService: Operating in MOCK mode.');
      const activeRecords = this.mockDatabase.filter(
        (item) => item.flgCancellazione !== 'S',
      );
      return of(activeRecords);
    }

    return this.api
      .get<
        VistaDatiEnergeticiDto[]
      >(`${this.basePath}/ricerca`, payload, options)
      .pipe(
        map((dtos: VistaDatiEnergeticiDto[]) =>
          dtos.map(
            (dto) =>
              new DatiEnergeticiModel({
                idDati: dto.idDati,
                anno: dto.anno,
                idCer: dto.idCer,
                idConfigurazione: dto.idConfig,
                flgCancellazione: dto.statoScheda === 'S' ? 'S' : 'N',

                energiaProdotta: dto.energiaProdottaMwh ?? null,
                energiaPrelevata: dto.energiaPrelevataMwh ?? null,
                energiaImmessa: dto.energiaImmessaMwh ?? null,
                energiaCondivisa: dto.energiaCondivisaMwh ?? null,
                energiaAutoCons: dto.energiaAutoconsumataMwh ?? null,
                ridEmCo2: dto.riduzioneCo2Ton ?? null,
              }),
          ),
        ),
      );
  }

  /**
   *
   */
  private generateMockList(): DatiEnergetici[] {
    const mockRecords: DatiEnergetici[] = [];
    const states = ['N', 'N', 'A'];

    for (let i = 1; i <= 12; i++) {
      mockRecords.push(
        new DatiEnergeticiModel({
          idDati: i,
          anno: (2015 + i).toString(),
          idCer: 40 + i,
          idConfigurazione: 100 + i,
          energiaProdotta: Math.floor(Math.random() * 500) + 100,
          energiaPrelevata: Math.floor(Math.random() * 400) + 50,
          energiaImmessa: Math.floor(Math.random() * 300) + 30,
          energiaCondivisa: Math.floor(Math.random() * 200) + 10,
          energiaAutoCons: Math.floor(Math.random() * 150) + 5,
          ridEmCo2: `${(Math.random() * 15).toFixed(2)}`,
          flgCancellazione: states[i % 3],
        }),
      );
    }
    return mockRecords;
  }

  /**
   * GET /api/dati-energetici/{id}
   */
  getDato(id: number): Observable<DatiEnergetici> {
    if (this.USE_MOCK_DATA) {
      const record = this.mockDatabase.find((item) => item.idDati === id);
      return of(record || this.fallbackSingleMock(id));
    }

    return this.api
      .get<DatiVisualizzaDto>(`${this.basePath}/${id}/visualizza`)
      .pipe(
        map(
          (dto: DatiVisualizzaDto) =>
            new DatiEnergeticiModel({
              idDati: dto.idSchedaEnergetica,
              idCer: dto.configurazioneCer?.idCer ?? null,
              idConfigurazione: dto.configurazioneCer?.idConfigurazione ?? null,
              anno: dto.annoRiferimento,
              energiaProdotta: dto.energiaProdottaMwh,
              energiaPrelevata: dto.energiaPrelevataMwh,
              energiaImmessa: dto.energiaImmessaMwh,
              energiaCondivisa: dto.energiaCondivisaMwh,
              energiaAutoCons: dto.energiaAutoconsumataMwh,
              tariffaPremium: dto.tariffaPremioEuro,
              corrPremioOtt: dto.corrispettivoPremioEuro,
              ridEmCo2: dto.riduzioneCo2Ton,
              flgCancellazione: 'N',
            }),
        ),
      );
  }

  /**
   * POST /api/dati-energetici
   */
  /**
   * POST /api/dati-energetici
   */
  createDatiEnergetici(
    payload: any,
    emailLoggato: string,
    options: ApiRequestOptions = {},
  ): Observable<string> {
    if (this.USE_MOCK_DATA) {
      console.warn('⚠️ DatiEnergeticiService: Simulating Creation locally.');

      const newId =
        this.mockDatabase.length > 0
          ? Math.max(...this.mockDatabase.map((o) => o.idDati || 0)) + 1
          : 1;
      const newRecord = new DatiEnergeticiModel({
        idDati: newId,
        anno: payload.anno || '2026',
        idCer: payload.idCer || 99,
        idConfigurazione: payload.idConfigurazione || 999,
        energiaProdotta: payload.energiaProdotta || 0,
        energiaPrelevata: payload.energiaPrelevata || 0,
        energiaImmessa: payload.energiaImmessa || 0,
        energiaCondivisa: payload.energiaCondivisa || 0,
        energiaAutoCons: payload.energiaAutoCons || 0,
        tariffaPremium: payload.tariffaPremium || 0,
        corrPremioOtt: payload.corrPremioOtt || 0,
        ridEmCo2: payload.ridEmCo2 ? `${payload.ridEmCo2}` : '0.00',
        flgCancellazione: 'N',
      });

      this.mockDatabase.push(newRecord);
      return of('Record inizializzato con successo (MOCK)!');
    }

    // 1. Run your existing converter safely
    const backendPayload = this.convertToBackendDto(payload, emailLoggato);

    console.log('FINAL PAYLOAD OUTBOUND FORWARD TO HTTP PORT:', backendPayload);

    // 2. Use raw http.post directly instead of this.api.postText to bypass the wrapper dropping the email
    return this.http.post(
      `http://localhost:8081/${this.basePath}/inserimento`,
      backendPayload,
      { responseType: 'text' },
    );
  }

  /**
   * PUT /api/dati-energetici/{id}
   */
  editDatiEnergetici(id: number, payload: any, email: string): Observable<any> {
    let resolvedEmail = email;
    if (!resolvedEmail) {
      const userState = this.utenteService.currentUser;
      resolvedEmail = userState?.utente?.mail || userState?.mail || '';
    }

    if (this.USE_MOCK_DATA) {
      console.warn(
        `⚠️ DatiEnergeticiService: Simulating Modification locally for ID: ${id}`,
      );

      const index = this.mockDatabase.findIndex((item) => item.idDati === id);
      if (index !== -1) {
        this.mockDatabase[index] = {
          ...this.mockDatabase[index],
          ...payload,
          idDati: id,
        };
      }
      return of('Modifica completata con successo (MOCK)!');
    }

    const backendBody = this.convertToBackendDto(payload, email);
    return this.http.put(
      `http://localhost:8081/api/dati-energetici/${id}/modifica`,
      backendBody,
      {
        responseType: 'text',
      },
    );
  }

  /**
   * DELETE /api/dati-energetici/{id}?emailUtenteLoggato=...
   */
  /**
   * DELETE /api/dati-energetici/{id}/disattiva?emailUtenteLoggato=...
   */
  deleteDatiEnergetici(
    id: number,
    email: string,
    options: ApiRequestOptions = {},
  ): Observable<string> {
    if (this.USE_MOCK_DATA) {
      console.warn(
        `⚠️ DatiEnergeticiService: Simulating Deletion locally for ID: ${id}`,
      );
      const index = this.mockDatabase.findIndex((item) => item.idDati === id);
      if (index !== -1) {
        this.mockDatabase[index].flgCancellazione = 'S';
      }
      return of('Record eliminato logicamente (MOCK)');
    }

    // const queryParams = new HttpParams().set(
    //   'emailUtenteLoggato',
    //   emailLoggato,
    // );

    return this.http.delete(
      `http://localhost:8081/api/dati-energetici/${id}/disattiva?emailUtenteLoggato=${email}`,
      {
        responseType: 'text',
      },
    );
  }

  /**
   * GET /api/dati-energetici/check?idConfigurazione=...&annoRiferimento=...
   */
  checkScheda(
    idConfigurazione: number,
    annoRiferimento: number,
  ): Observable<boolean> {
    if (this.USE_MOCK_DATA) {
      return of(
        this.mockDatabase.some(
          (item) =>
            item.idConfigurazione === idConfigurazione &&
            Number(item.anno) === annoRiferimento,
        ),
      );
    }
    const params = { idConfigurazione, annoRiferimento };
    return this.api.get<boolean>(`${this.basePath}/check`, params);
  }

  // --- metodi privati

  private initializeMockDatabase(): void {
    const rawBackendJson = [
      { idDati: 1, anno: '2025', idCer: 42, idConfig: 46, statoScheda: 'N' },
      { idDati: 2, anno: '2012', idCer: 43, idConfig: 1, statoScheda: 'N' },
      { idDati: 3, anno: '2023', idCer: 44, idConfig: 1, statoScheda: 'S' },
      { idDati: 4, anno: '2025', idCer: 45, idConfig: 1, statoScheda: 'N' },
      { idDati: 5, anno: '2026', idCer: 41, idConfig: 46, statoScheda: 'N' },
      { idDati: 7, anno: '2025', idCer: 42, idConfig: 45, statoScheda: 'N' },
      { idDati: 8, anno: '2025', idCer: 43, idConfig: 45, statoScheda: 'N' },
      { idDati: 9, anno: '2025', idCer: 44, idConfig: 1, statoScheda: 'N' },
      { idDati: 10, anno: '2025', idCer: 45, idConfig: 45, statoScheda: 'N' },
      { idDati: 12, anno: '2025', idCer: 41, idConfig: 1, statoScheda: 'N' },
      { idDati: 13, anno: '2025', idCer: 42, idConfig: 1, statoScheda: 'S' },
    ];

    this.mockDatabase = rawBackendJson.map(
      (item) =>
        new DatiEnergeticiModel({
          idDati: item.idDati,
          anno: item.anno,
          idCer: item.idCer,
          idConfigurazione: item.idConfig,
          flgCancellazione: item.statoScheda,
          energiaProdotta: Math.floor(Math.random() * 400) + 100,
          energiaPrelevata: Math.floor(Math.random() * 300) + 50,
          energiaImmessa: Math.floor(Math.random() * 200) + 20,
          energiaCondivisa: Math.floor(Math.random() * 100) + 10,
          energiaAutoCons: Math.floor(Math.random() * 50) + 5,
          ridEmCo2: `${(Math.random() * 10).toFixed(2)}`,
        }),
    );
  }

  private fallbackSingleMock(id: number): DatiEnergetici {
    return new DatiEnergeticiModel({
      idDati: id,
      anno: '2025',
      idCer: 42,
      idConfigurazione: 46,
      energiaProdotta: 250,
      energiaPrelevata: 180,
      energiaImmessa: 140,
      energiaCondivisa: 85,
      energiaAutoCons: 40,
      ridEmCo2: '4.20',
      flgCancellazione: 'N',
    });
  }

  private convertToBackendDto(
    model: DatiEnergetici | any,
    emailLoggato?: string,
  ): any {
    let finalEmail = typeof emailLoggato === 'string' ? emailLoggato : '';

    if (!finalEmail || finalEmail.trim() === '') {
      const userState = this.utenteService?.currentUser;
      finalEmail =
        userState?.utente?.email ||
        userState?.utente?.mail ||
        userState?.email ||
        userState?.mail ||
        '';
    }

    if (!finalEmail || finalEmail.trim() === '') {
      finalEmail = 'tastymeat@example.com';
    }

    const outboundPayload = {
      idSchedaEnergetica: model.idDati
        ? Number(model.idDati)
        : model.idSchedaEnergetica
          ? Number(model.idSchedaEnergetica)
          : 0,
      idCer: model.idCer ? Number(model.idCer) : 0,
      idConfigurazione: model.idConfigurazione
        ? Number(model.idConfigurazione)
        : 0,

      annoRiferimento: model.anno
        ? model.anno.toString()
        : model.annoRiferimento
          ? model.annoRiferimento.toString()
          : '2023',

      energiaProdottaMwh:
        model.energiaProdotta !== undefined && model.energiaProdotta !== null
          ? Number(model.energiaProdotta)
          : model.energiaProdottaMwh
            ? Number(model.energiaProdottaMwh)
            : 0,
      energiaPrelevataMwh:
        model.energiaPrelevata !== undefined && model.energiaPrelevata !== null
          ? Number(model.energiaPrelevata)
          : model.energiaPrelevataMwh
            ? Number(model.energiaPrelevataMwh)
            : 0,
      energiaImmessaMwh:
        model.energiaImmessa !== undefined && model.energiaImmessa !== null
          ? Number(model.energiaImmessa)
          : model.energiaImmessaMwh
            ? Number(model.energiaImmessaMwh)
            : 0,
      energiaCondivisaMwh:
        model.energiaCondivisa !== undefined && model.energiaCondivisa !== null
          ? Number(model.energiaCondivisa)
          : model.energiaCondivisaMwh
            ? Number(model.energiaCondivisaMwh)
            : 0,

      energiaAutoconsumataMwh:
        model.energiaAutoCons !== undefined &&
        model.energiaAutoCons !== null &&
        model.energiaAutoCons !== 0
          ? Number(model.energiaAutoCons)
          : model.energiaAutoconsumataMwh
            ? Number(model.energiaAutoconsumataMwh)
            : Math.max(
                0,
                Number(model.energiaProdotta || model.energiaProdottaMwh || 0) -
                  Number(model.energiaImmessa || model.energiaImmessaMwh || 0),
              ),

      tariffaPremioEuro:
        model.tariffaPremium !== undefined && model.tariffaPremium !== null
          ? Number(model.tariffaPremium)
          : model.tariffaPremioEuro
            ? Number(model.tariffaPremioEuro)
            : 0.0,
      corrispettivoPremioEuro:
        model.corrPremioOtt !== undefined && model.corrPremioOtt !== null
          ? Number(model.corrPremioOtt)
          : model.corrispettivoPremioEuro
            ? Number(model.corrispettivoPremioEuro)
            : 0.0,

      riduzioneCo2Ton: model.ridEmCo2
        ? model.ridEmCo2.toString()
        : model.riduzioneCo2Ton
          ? model.riduzioneCo2Ton.toString()
          : '0.00',

      calcoloCo2Automatico: model.calcoloCo2Automatico ?? true,
      note: model.note ?? '',
      flgCancellazione: model.flgCancellazione ?? 'N',

      emailUtenteLoggato: finalEmail,
    };

    console.log(
      'VERIFIED RAW PAYLOAD DEPARTING SERVICE MAPPER:',
      outboundPayload,
    );
    return outboundPayload;
  }
}
