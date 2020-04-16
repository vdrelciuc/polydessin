import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlumeGuideComponent } from './plume-guide.component';

describe('PlumeGuideComponent', () => {
  let component: PlumeGuideComponent;
  let fixture: ComponentFixture<PlumeGuideComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlumeGuideComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlumeGuideComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
