import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DettaglioImpiantoComponent } from './dettaglio-impianto.component';

describe('DettaglioImpiantoComponent', () => {
  let component: DettaglioImpiantoComponent;
  let fixture: ComponentFixture<DettaglioImpiantoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DettaglioImpiantoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DettaglioImpiantoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
