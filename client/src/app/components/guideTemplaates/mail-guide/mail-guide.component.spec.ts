import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MailGuideComponent } from './mail-guide.component';

describe('MailGuideComponent', () => {
  let component: MailGuideComponent;
  let fixture: ComponentFixture<MailGuideComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MailGuideComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MailGuideComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
