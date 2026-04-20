import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DettaglioDatiEnergeticiComponent } from './dettaglio-dati-energetici.component';

describe('DettaglioDatiEnergeticiComponent', () => {
  let component: DettaglioDatiEnergeticiComponent;
  let fixture: ComponentFixture<DettaglioDatiEnergeticiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DettaglioDatiEnergeticiComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DettaglioDatiEnergeticiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
