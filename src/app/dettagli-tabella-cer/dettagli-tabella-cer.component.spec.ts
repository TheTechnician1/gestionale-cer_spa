import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { of } from 'rxjs';

import { DettagliTabellaCerComponent } from './dettagli-tabella-cer.component';

describe('DettagliTabellaCerComponent', () => {
  let component: DettagliTabellaCerComponent;
  let fixture: ComponentFixture<DettagliTabellaCerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DettagliTabellaCerComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            paramMap: of(convertToParamMap({ id: '1' })),
          },
        },
      ],
    })
      .compileComponents();

    fixture = TestBed.createComponent(DettagliTabellaCerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
