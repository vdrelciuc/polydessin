import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CrayonGuideComponent } from './crayon-guide.component';

describe('CrayonGuideComponent', () => {
  let component: CrayonGuideComponent;
  let fixture: ComponentFixture<CrayonGuideComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CrayonGuideComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CrayonGuideComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
