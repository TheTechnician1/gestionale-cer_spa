import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModificaDatiEnergeticiComponent } from './modifica-dati-energetici.component';

describe('ModificaDatiEnergeticiComponent', () => {
  let component: ModificaDatiEnergeticiComponent;
  let fixture: ComponentFixture<ModificaDatiEnergeticiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModificaDatiEnergeticiComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModificaDatiEnergeticiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
