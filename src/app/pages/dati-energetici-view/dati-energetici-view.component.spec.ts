import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DatiEnergeticiViewComponent } from './dati-energetici-view.component';

describe('DatiEnergeticiViewComponent', () => {
  let component: DatiEnergeticiViewComponent;
  let fixture: ComponentFixture<DatiEnergeticiViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DatiEnergeticiViewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DatiEnergeticiViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
