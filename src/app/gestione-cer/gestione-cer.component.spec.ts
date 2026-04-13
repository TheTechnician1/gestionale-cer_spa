import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestioneCERComponent } from './gestione-cer.component';

describe('GestioneCERComponent', () => {
  let component: GestioneCERComponent;
  let fixture: ComponentFixture<GestioneCERComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GestioneCERComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GestioneCERComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
