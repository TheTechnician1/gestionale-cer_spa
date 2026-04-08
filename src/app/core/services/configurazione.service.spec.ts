import { TestBed } from '@angular/core/testing';

import { ConfigurazioneService } from './configurazione.service';

describe('ConfigurazioneService', () => {
  let service: ConfigurazioneService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ConfigurazioneService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
