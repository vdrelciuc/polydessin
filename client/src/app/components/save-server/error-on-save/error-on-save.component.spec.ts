import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ErrorOnSaveComponent } from './error-on-save.component';

describe('ErrorOnSaveComponent', () => {
  let component: ErrorOnSaveComponent;
  let fixture: ComponentFixture<ErrorOnSaveComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ErrorOnSaveComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ErrorOnSaveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
