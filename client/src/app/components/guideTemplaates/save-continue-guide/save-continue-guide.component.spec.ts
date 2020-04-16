import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SaveContinueGuideComponent } from './save-continue-guide.component';

describe('SaveContinueGuideComponent', () => {
  let component: SaveContinueGuideComponent;
  let fixture: ComponentFixture<SaveContinueGuideComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SaveContinueGuideComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SaveContinueGuideComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
