import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigurazioneComponent } from './configurazione.component';

describe('ConfigurazioneComponent', () => {
  let component: ConfigurazioneComponent;
  let fixture: ComponentFixture<ConfigurazioneComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConfigurazioneComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConfigurazioneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
