import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { FormRicercaCerComponent } from './form-ricerca-cer.component';

describe('FormRicercaCerComponent', () => {
  let component: FormRicercaCerComponent;
  let fixture: ComponentFixture<FormRicercaCerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FormRicercaCerComponent],
      imports: [ReactiveFormsModule],
      schemas: [NO_ERRORS_SCHEMA],
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
