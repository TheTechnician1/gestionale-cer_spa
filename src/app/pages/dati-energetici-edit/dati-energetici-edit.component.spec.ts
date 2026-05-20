import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DatiEnergeticiEditComponent } from './dati-energetici-edit.component';

describe('DatiEnergeticiEditComponent', () => {
  let component: DatiEnergeticiEditComponent;
  let fixture: ComponentFixture<DatiEnergeticiEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DatiEnergeticiEditComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DatiEnergeticiEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
