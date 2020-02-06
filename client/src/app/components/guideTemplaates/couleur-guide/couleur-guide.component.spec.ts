import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CouleurGuideComponent } from './couleur-guide.component';

describe('CouleurGuideComponent', () => {
  let component: CouleurGuideComponent;
  let fixture: ComponentFixture<CouleurGuideComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CouleurGuideComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CouleurGuideComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
