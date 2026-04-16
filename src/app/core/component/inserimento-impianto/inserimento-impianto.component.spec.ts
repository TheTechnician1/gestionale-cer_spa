import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InserimentoImpiantoComponent } from './inserimento-impianto.component';

describe('InserimentoImpiantoComponent', () => {
  let component: InserimentoImpiantoComponent;
  let fixture: ComponentFixture<InserimentoImpiantoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InserimentoImpiantoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InserimentoImpiantoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
