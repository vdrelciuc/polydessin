import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExportComponent } from './export.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { MatRadioModule, MatGridListModule, MatDialogRef } from '@angular/material';

describe('ExportComponent', () => {
  let component: ExportComponent;
  let fixture: ComponentFixture<ExportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExportComponent ],
      providers: [
        {
          provide: MatDialogRef,
          useValue: {
            moduleDef: ExportComponent,
            close: () => null,
          },
        },
      ],
      imports: [
        MatRadioModule,
        MatGridListModule
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
    fixture = TestBed.createComponent(ExportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
