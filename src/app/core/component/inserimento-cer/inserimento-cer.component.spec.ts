import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InserimentoCerComponent } from './inserimento-cer.component';

describe('InserimentoCerComponent', () => {
  let component: InserimentoCerComponent;
  let fixture: ComponentFixture<InserimentoCerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InserimentoCerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InserimentoCerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
