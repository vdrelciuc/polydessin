import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PipetteGuideComponent } from './pipette-guide.component';

describe('PipetteGuideComponent', () => {
  let component: PipetteGuideComponent;
  let fixture: ComponentFixture<PipetteGuideComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PipetteGuideComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PipetteGuideComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
