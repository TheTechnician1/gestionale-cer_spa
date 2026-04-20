import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModificaImpiantoComponent } from './modifica-impianto.component';

describe('ModificaImpiantoComponent', () => {
  let component: ModificaImpiantoComponent;
  let fixture: ComponentFixture<ModificaImpiantoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModificaImpiantoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModificaImpiantoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
