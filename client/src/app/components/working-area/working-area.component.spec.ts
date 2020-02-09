import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormsModule } from '@angular/forms';
import { MatDialogModule, MatFormFieldModule, MatOptionModule,
  MatSelectModule, MatSidenavModule, MatSliderModule } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { DrawerService } from 'src/app/services/side-nav-drawer/drawer.service';
import { CanvasComponent } from '../canvas/canvas.component';
import { LineComponent } from '../line/line.component';
import { OptionPannelComponent } from '../option-pannel/option-pannel.component';
import { PencilComponent } from '../pencil/pencil.component';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { WorkspaceComponent } from '../workspace/workspace.component';
import { WorkingAreaComponent } from './working-area.component';

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
            { path: '', component: SidebarComponent}
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
    const drawer = TestBed.get<DrawerService>(DrawerService);
    drawer.navIsOpened = false;
    expect(component.getDrawerStatus()).toBe(false);
  });
});
