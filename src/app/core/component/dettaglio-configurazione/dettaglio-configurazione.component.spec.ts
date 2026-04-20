import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DettaglioConfigurazioneComponent } from './dettaglio-configurazione.component';

describe('DettaglioConfigurazioneComponent', () => {
  let component: DettaglioConfigurazioneComponent;
  let fixture: ComponentFixture<DettaglioConfigurazioneComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DettaglioConfigurazioneComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DettaglioConfigurazioneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
