import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SceauGuideComponent } from './sceau-guide.component';

describe('SceauGuideComponent', () => {
  let component: SceauGuideComponent;
  let fixture: ComponentFixture<SceauGuideComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SceauGuideComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SceauGuideComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
