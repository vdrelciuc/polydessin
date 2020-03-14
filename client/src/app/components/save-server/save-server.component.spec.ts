import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SaveServerComponent } from './save-server.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { MatDialogRef, MatSnackBarModule, MatDialogModule } from '@angular/material';
import { HttpClientModule } from '@angular/common/http';

describe('SaveServerComponent', () => {
  let component: SaveServerComponent;
  let fixture: ComponentFixture<SaveServerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SaveServerComponent ],
      providers: [
        {
          provide: MatDialogRef,
          useValue: {
            moduleDef: SaveServerComponent,
            close: () => null,
          },
        },
      ],
      imports: [
        MatSnackBarModule,
        HttpClientModule,
        MatDialogModule,
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SaveServerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
