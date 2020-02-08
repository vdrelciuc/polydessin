import { ComponentFixture, getTestBed, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MatCheckboxModule, MatDialog, MatDividerModule, MatExpansionModule, MatFormFieldModule,
  MatIconModule, MatInputModule, MatOptionModule, MatRadioModule, MatSelectModule, MatSliderModule } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Tools } from 'src/app/enums/tools';
import { HotkeysService } from 'src/app/services/events/shortcuts/hotkeys.service';
import { LineService } from 'src/app/services/index/drawable/line/line.service';
import { PencilService } from 'src/app/services/index/drawable/pencil/pencil.service';
import { DrawablePropertiesService } from 'src/app/services/index/drawable/properties/drawable-properties.service';
import { DrawerService } from 'src/app/services/side-nav-drawer/drawer.service';
import { ToolSelectorService } from 'src/app/services/tools/tool-selector.service';
import { BrushComponent } from '../brush/brush.component';
import { ColorPaletteComponent } from '../color-palette/color-palette.component';
import { ColorPanelComponent } from '../color-panel/color-panel.component';
import { ColorPickerComponent } from '../color-picker/color-picker.component';
import { ColorSliderComponent } from '../color-slider/color-slider.component';
import { LineComponent } from '../line/line.component';
import { PencilComponent } from '../pencil/pencil.component';
import { RectangleComponent } from '../rectangle/rectangle.component';
import { OptionPannelComponent } from './option-pannel.component';

describe('OptionPannelComponent', () => {
  let component: OptionPannelComponent;
  let fixture: ComponentFixture<OptionPannelComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        // ADD HERE ALL THE OTHER ADDED TOOLS
        OptionPannelComponent,
        LineComponent,
        PencilComponent,
        RectangleComponent,
        BrushComponent,
        ColorPanelComponent,
      ],
      providers: [
        ColorPaletteComponent,
        ColorPanelComponent,
        ColorPickerComponent,
        ColorSliderComponent,
        BrushComponent,
        OptionPannelComponent,
        HotkeysService,
        LineService,
        ToolSelectorService,
        DrawablePropertiesService,
        DrawerService,
        PencilService,
        RectangleComponent,
        MatDialog
      ],
      imports: [
        BrowserAnimationsModule,
        FormsModule,
        MatSliderModule,
        MatFormFieldModule,
        MatOptionModule,
        MatSelectModule,
        MatInputModule,
        MatDividerModule,
        MatExpansionModule,
        MatIconModule,
        MatRadioModule,
        MatCheckboxModule,
      ]
    })
    .compileComponents();
    component = getTestBed().get(OptionPannelComponent);
    fixture = TestBed.createComponent(OptionPannelComponent);
    component = fixture.componentInstance;
    component.ngOnInit();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should subscribe to tool', () => {
    component.toolSelectorService.setCurrentTool(Tools.Line);
    expect(component.currentTool).toEqual(Tools.Line);
  });
});
