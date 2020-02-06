import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LigneGuideComponent } from './ligne-guide.component';

describe('LigneGuideComponent', () => {
  let component: LigneGuideComponent;
  let fixture: ComponentFixture<LigneGuideComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LigneGuideComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LigneGuideComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
