import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CanvasComponent } from '../canvas/canvas.component';
import { WorkspaceComponent } from './workspace.component';
import { HttpClientModule } from '@angular/common/http';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { MatSnackBarModule } from '@angular/material';

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
});
