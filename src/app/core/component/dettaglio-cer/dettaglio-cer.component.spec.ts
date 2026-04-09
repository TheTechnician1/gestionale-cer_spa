import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DettaglioCerComponent } from './dettaglio-cer.component';

describe('DettaglioCerComponent', () => {
  let component: DettaglioCerComponent;
  let fixture: ComponentFixture<DettaglioCerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DettaglioCerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DettaglioCerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
