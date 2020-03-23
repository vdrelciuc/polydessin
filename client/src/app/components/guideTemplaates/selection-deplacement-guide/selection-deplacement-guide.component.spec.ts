import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectionDeplacementGuideComponent } from './selection-deplacement-guide.component';

describe('SelectionDeplacementGuideComponent', () => {
  let component: SelectionDeplacementGuideComponent;
  let fixture: ComponentFixture<SelectionDeplacementGuideComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelectionDeplacementGuideComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectionDeplacementGuideComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
