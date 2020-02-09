import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WarningDialogComponent } from './warning-dialog.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('WarningDialogComponent', () => {
  let component: WarningDialogComponent;
  let fixture: ComponentFixture<WarningDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WarningDialogComponent ],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
    fixture = TestBed.createComponent(WarningDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));
  
  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
