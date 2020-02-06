import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkingAreaComponent } from './working-area.component';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { MatSidenavModule, MatSliderModule, MatFormFieldModule, MatOptionModule, MatSelectModule, MatDialogModule } from '@angular/material';
import { OptionPannelComponent } from '../option-pannel/option-pannel.component';
import { LineComponent } from '../line/line.component';
import { PencilComponent } from '../pencil/pencil.component';
import { WorkspaceComponent } from '../workspace/workspace.component';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CanvasComponent } from '../canvas/canvas.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DrawerService } from 'src/app/services/side-nav-drawer/drawer.service';

describe('WorkingAreaComponent', () => {
  let component: WorkingAreaComponent;
  let fixture: ComponentFixture<WorkingAreaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ 
        CanvasComponent,
        OptionPannelComponent,
        WorkingAreaComponent, 
        SidebarComponent,
        LineComponent,
        PencilComponent,
        WorkspaceComponent ],
      imports: [
        BrowserAnimationsModule,
        MatDialogModule,
        MatSidenavModule,
        RouterModule.forRoot(
          [
            { path: "", component: SidebarComponent}
          ]
        ),
        FormsModule,
        MatSliderModule,
        MatFormFieldModule,
        MatOptionModule,
        MatSelectModule
      ]
    })
    .compileComponents();
    fixture = TestBed.createComponent(WorkingAreaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should drawer be open', () => {
    expect(component.getDrawerStatus()).toBeTruthy();
  });

  it('should drawer be closed', () => {
    let drawer = TestBed.get<DrawerService>(DrawerService);
    drawer.navIsOpened = false;
    expect(component.getDrawerStatus()).toBe(false);
  });
});
