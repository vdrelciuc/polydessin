import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClipboardGuideComponent } from './clipboard-guide.component';

describe('ClipboardGuideComponent', () => {
  let component: ClipboardGuideComponent;
  let fixture: ComponentFixture<ClipboardGuideComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClipboardGuideComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClipboardGuideComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
