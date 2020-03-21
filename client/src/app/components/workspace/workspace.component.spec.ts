import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CanvasComponent } from '../canvas/canvas.component';
import { WorkspaceComponent } from './workspace.component';
import { HttpClientModule } from '@angular/common/http';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { MatSnackBarModule } from '@angular/material';
import { CoordinatesXY } from 'src/app/classes/coordinates-x-y';

describe('WorkspaceComponent', () => {
  let component: WorkspaceComponent;
  let fixture: ComponentFixture<WorkspaceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WorkspaceComponent, CanvasComponent ], 
      imports: [
        HttpClientModule,
        MatSnackBarModule,
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
    fixture = TestBed.createComponent(WorkspaceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    component.ngOnInit();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('#onResize should resize workspace', () => {
    component.onResize({
      target: {
        offsetWidth: 100,
        offsetHeight: 200
      }
    });
    expect(component['workspaceService'].Size.value).toEqual(new CoordinatesXY(100, 200));
  });
});
