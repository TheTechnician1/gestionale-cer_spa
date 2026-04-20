import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InserimentoDatiEnergeticiComponent } from './inserimento-dati-energetici.component';

describe('InserimentoDatiEnergeticiComponent', () => {
  let component: InserimentoDatiEnergeticiComponent;
  let fixture: ComponentFixture<InserimentoDatiEnergeticiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InserimentoDatiEnergeticiComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InserimentoDatiEnergeticiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
