import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BienvenueGuideComponent } from './bienvenue-guide.component';

describe('BienvenueGuideComponent', () => {
  let component: BienvenueGuideComponent;
  let fixture: ComponentFixture<BienvenueGuideComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BienvenueGuideComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BienvenueGuideComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
