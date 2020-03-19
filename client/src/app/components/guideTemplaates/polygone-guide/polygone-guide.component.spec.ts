import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PolygoneGuideComponent } from './polygone-guide.component';

describe('PolygoneGuideComponent', () => {
  let component: PolygoneGuideComponent;
  let fixture: ComponentFixture<PolygoneGuideComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PolygoneGuideComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PolygoneGuideComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
