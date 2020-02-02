import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NouveauDessinComponent } from './nouveau-dessin.component';

describe('NouveauDessinComponent', () => {
  let component: NouveauDessinComponent;
  let fixture: ComponentFixture<NouveauDessinComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NouveauDessinComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NouveauDessinComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
