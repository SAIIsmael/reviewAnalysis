 import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SentenceTagComponent } from './sentence-tag.component';

describe('SentenceTagComponent', () => {
  let component: SentenceTagComponent;
  let fixture: ComponentFixture<SentenceTagComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SentenceTagComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SentenceTagComponent);
     component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
