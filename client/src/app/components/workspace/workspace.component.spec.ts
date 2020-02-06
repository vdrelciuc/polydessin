import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkspaceComponent } from './workspace.component';
import { CanvasComponent } from '../canvas/canvas.component';

describe('WorkspaceComponent', () => {
  let component: WorkspaceComponent;
  let fixture: ComponentFixture<WorkspaceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WorkspaceComponent, CanvasComponent ]
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
