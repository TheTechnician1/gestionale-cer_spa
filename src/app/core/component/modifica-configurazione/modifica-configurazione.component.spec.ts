import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModificaConfigurazioneComponent } from './modifica-configurazione.component';

describe('ModificaConfigurazioneComponent', () => {
  let component: ModificaConfigurazioneComponent;
  let fixture: ComponentFixture<ModificaConfigurazioneComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModificaConfigurazioneComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModificaConfigurazioneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
