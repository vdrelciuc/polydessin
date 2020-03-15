import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PinceauGuideComponent } from './pinceau-guide.component';

describe('PinceauGuideComponent', () => {
  let component: PinceauGuideComponent;
  let fixture: ComponentFixture<PinceauGuideComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PinceauGuideComponent ]
    })
    .compileComponents();
    fixture = TestBed.createComponent(PinceauGuideComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
