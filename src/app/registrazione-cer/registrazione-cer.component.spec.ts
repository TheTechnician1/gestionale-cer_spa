import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistrazioneCerComponent } from './registrazione-cer.component';

describe('RegistrazioneCerComponent', () => {
  let component: RegistrazioneCerComponent;
  let fixture: ComponentFixture<RegistrazioneCerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RegistrazioneCerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegistrazioneCerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
