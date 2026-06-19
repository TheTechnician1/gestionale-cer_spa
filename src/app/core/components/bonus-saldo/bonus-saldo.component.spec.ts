import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BonusSaldoComponent } from './bonus-saldo.component';

describe('BonusSaldoComponent', () => {
  let component: BonusSaldoComponent;
  let fixture: ComponentFixture<BonusSaldoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BonusSaldoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BonusSaldoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
