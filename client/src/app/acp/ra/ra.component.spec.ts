import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RAComponent } from './ra.component';

describe('RAComponent', () => {
  let component: RAComponent;
  let fixture: ComponentFixture<RAComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RAComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RAComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
