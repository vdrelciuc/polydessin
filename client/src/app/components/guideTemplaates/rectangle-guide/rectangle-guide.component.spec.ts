import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RectangleGuideComponent } from './rectangle-guide.component';

describe('RectangleGuideComponent', () => {
  let component: RectangleGuideComponent;
  let fixture: ComponentFixture<RectangleGuideComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RectangleGuideComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RectangleGuideComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
