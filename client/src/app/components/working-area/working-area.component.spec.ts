import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkingAreaComponent } from './working-area.component';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { MatSidenavModule, MatSliderModule, MatFormFieldModule, MatOptionModule, MatSelectModule, MatDialogModule, MatDividerModule, MatRadioModule, MatExpansionModule, MatIconModule, MatTooltipModule, MatCheckboxModule, MatSlideToggleModule } from '@angular/material';
import { OptionPannelComponent } from '../option-pannel/option-pannel.component';
import { LineComponent } from '../line/line.component';
import { PencilComponent } from '../pencil/pencil.component';
import { WorkspaceComponent } from '../workspace/workspace.component';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CanvasComponent } from '../canvas/canvas.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DrawerService } from 'src/app/services/side-nav-drawer/drawer.service';
import { RectangleComponent } from '../rectangle/rectangle.component';
import { BrushComponent } from '../brush/brush.component';
import { ColorPanelComponent } from '../color-panel/color-panel.component';
import { ColorPaletteComponent } from '../color-palette/color-palette.component';
import { ColorPickerComponent } from '../color-picker/color-picker.component';
import { ColorSliderComponent } from '../color-slider/color-slider.component';
import { CreateNewComponent } from '../create-new/create-new.component';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';

describe('WorkingAreaComponent', () => {
  let component: WorkingAreaComponent;
  let fixture: ComponentFixture<WorkingAreaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ 
        CanvasComponent,
        CreateNewComponent,
        ColorPanelComponent,
        ColorPaletteComponent,
        ColorPickerComponent,
        ColorSliderComponent,
        BrushComponent,
        OptionPannelComponent,
        WorkingAreaComponent, 
        SidebarComponent,
        LineComponent,
        PencilComponent,
        RectangleComponent,
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
        MatSelectModule,
        MatDividerModule,
        MatRadioModule,
        MatExpansionModule,
        MatIconModule,
        MatTooltipModule,
        MatCheckboxModule,
        MatSlideToggleModule,
      ]
    })
    .overrideModule(BrowserDynamicTestingModule, { set: { entryComponents: [CreateNewComponent] } })
    .compileComponents();
    
    fixture = TestBed.createComponent(WorkingAreaComponent);
    component = fixture.componentInstance;
    history.pushState({
      comingFromEntryPoint: true
    }, 'mockState');
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('#ngOnInit shouldn\'t open', () => {
    const spy = spyOn(component['dialog'], 'open');
    history.pushState({
      comingFromEntryPoint: false
    }, 'mockState');
    component.ngOnInit();
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      expect(spy).not.toHaveBeenCalled();
    });
  });

  it('#ngOnInit shouldn open', () => {
    const spy = spyOn(component['dialog'], 'open');
    history.pushState({
      comingFromEntryPoint: true
    }, 'mockState');
    component.ngOnInit();
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      expect(spy).toHaveBeenCalledWith(CreateNewComponent, { disableClose: true });
    });
  });

  it('#getDrawerStatus should drawer be open', () => {
    expect(component.getDrawerStatus()).toBeTruthy();
  });

  it('#getDrawerStatus should drawer be closed', () => {
    let drawer = TestBed.get<DrawerService>(DrawerService);
    drawer.navIsOpened = false;
    expect(component.getDrawerStatus()).toBe(false);
  });
});
