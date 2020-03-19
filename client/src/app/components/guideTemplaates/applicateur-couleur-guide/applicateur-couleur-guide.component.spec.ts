import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplicateurCouleurGuideComponent } from './applicateur-couleur-guide.component';

describe('ApplicateurCouleurGuideComponent', () => {
  let component: ApplicateurCouleurGuideComponent;
  let fixture: ComponentFixture<ApplicateurCouleurGuideComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ApplicateurCouleurGuideComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApplicateurCouleurGuideComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
