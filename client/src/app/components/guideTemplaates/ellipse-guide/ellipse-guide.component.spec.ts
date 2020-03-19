import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EllipseGuideComponent } from './ellipse-guide.component';

describe('EllipseGuideComponent', () => {
  let component: EllipseGuideComponent;
  let fixture: ComponentFixture<EllipseGuideComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EllipseGuideComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EllipseGuideComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
