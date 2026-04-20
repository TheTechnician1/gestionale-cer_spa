import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TabellaCERComponent } from './tabella-cer.component';

describe('TabellaCERComponent', () => {
  let component: TabellaCERComponent;
  let fixture: ComponentFixture<TabellaCERComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TabellaCERComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TabellaCERComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
