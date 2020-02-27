import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WarningExportComponent } from './warning-export.component';

describe('WarningExportComponent', () => {
  let component: WarningExportComponent;
  let fixture: ComponentFixture<WarningExportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WarningExportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WarningExportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
