import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GalleryGuideComponent } from './gallery-guide.component';

describe('GalleryGuideComponent', () => {
  let component: GalleryGuideComponent;
  let fixture: ComponentFixture<GalleryGuideComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GalleryGuideComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GalleryGuideComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
