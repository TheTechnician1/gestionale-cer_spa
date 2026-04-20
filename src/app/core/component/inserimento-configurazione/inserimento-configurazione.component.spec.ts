import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InserimentoConfigurazioneComponent } from './inserimento-configurazione.component';

describe('InserimentoConfigurazioneComponent', () => {
  let component: InserimentoConfigurazioneComponent;
  let fixture: ComponentFixture<InserimentoConfigurazioneComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InserimentoConfigurazioneComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InserimentoConfigurazioneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
