import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DatiEnergeticiComponent } from './dati-energetici.component';

describe('DatiEnergeticiComponent', () => {
  let component: DatiEnergeticiComponent;
  let fixture: ComponentFixture<DatiEnergeticiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DatiEnergeticiComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DatiEnergeticiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
