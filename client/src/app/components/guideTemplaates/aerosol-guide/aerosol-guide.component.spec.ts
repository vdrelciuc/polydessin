import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AerosolGuideComponent } from './aerosol-guide.component';

describe('AerosolGuideComponent', () => {
  let component: AerosolGuideComponent;
  let fixture: ComponentFixture<AerosolGuideComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AerosolGuideComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AerosolGuideComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
