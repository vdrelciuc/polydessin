import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RotationGuideComponent } from './rotation-guide.component';

describe('RotationGuideComponent', () => {
  let component: RotationGuideComponent;
  let fixture: ComponentFixture<RotationGuideComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RotationGuideComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RotationGuideComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
