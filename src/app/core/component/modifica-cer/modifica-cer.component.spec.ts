import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModificaCerComponent } from './modifica-cer.component';

describe('ModificaCerComponent', () => {
  let component: ModificaCerComponent;
  let fixture: ComponentFixture<ModificaCerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModificaCerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModificaCerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
