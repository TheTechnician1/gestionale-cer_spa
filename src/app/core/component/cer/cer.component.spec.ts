import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CERComponent } from './cer.component';

describe('CERComponent', () => {
  let component: CERComponent;
  let fixture: ComponentFixture<CERComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CERComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CERComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
