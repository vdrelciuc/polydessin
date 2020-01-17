import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OptionPannelComponent } from './option-pannel.component';

describe('OptionPannelComponent', () => {
  let component: OptionPannelComponent;
  let fixture: ComponentFixture<OptionPannelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OptionPannelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OptionPannelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
