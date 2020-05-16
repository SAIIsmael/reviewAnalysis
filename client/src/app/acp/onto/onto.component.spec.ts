import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OntoComponent } from './onto.component';

describe('OntoComponent', () => {
  let component: OntoComponent;
  let fixture: ComponentFixture<OntoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OntoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OntoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
