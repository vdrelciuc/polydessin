import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GridGuideComponent } from './grid-guide.component';

describe('GridGuideComponent', () => {
  let component: GridGuideComponent;
  let fixture: ComponentFixture<GridGuideComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GridGuideComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GridGuideComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
