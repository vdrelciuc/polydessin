import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SaveServerGuideComponent } from './save-server-guide.component';

describe('SaveServerGuideComponent', () => {
  let component: SaveServerGuideComponent;
  let fixture: ComponentFixture<SaveServerGuideComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SaveServerGuideComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SaveServerGuideComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
