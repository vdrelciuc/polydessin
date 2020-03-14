import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GalleryComponent } from './gallery.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { MatFormFieldModule, MatChipsModule, MatGridListModule, MatDialogRef, MatSnackBarModule, MatDialogModule, MatInputModule } from '@angular/material';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('GalleryComponent', () => {
  let component: GalleryComponent;
  let fixture: ComponentFixture<GalleryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GalleryComponent ],
      providers: [
        {
          provide: MatDialogRef,
          useValue: {
            moduleDef: GalleryComponent,
            close: () => null,
          }
        },
      ],
      imports: [
        MatFormFieldModule,
        MatChipsModule,
        MatGridListModule,
        HttpClientModule,
        MatSnackBarModule,
        MatDialogModule,
        MatInputModule,
        BrowserAnimationsModule
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
    fixture = TestBed.createComponent(GalleryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
