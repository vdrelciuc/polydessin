import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TextGuideComponent } from './text-guide.component';

describe('TextGuideComponent', () => {
  let component: TextGuideComponent;
  let fixture: ComponentFixture<TextGuideComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TextGuideComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TextGuideComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
