import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormRicercaCerComponent } from './form-ricerca-cer.component';

describe('FormRicercaCerComponent', () => {
  let component: FormRicercaCerComponent;
  let fixture: ComponentFixture<FormRicercaCerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormRicercaCerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormRicercaCerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
