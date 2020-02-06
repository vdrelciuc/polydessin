import { ComponentFixture, TestBed, getTestBed } from '@angular/core/testing';

import { OptionPannelComponent } from './option-pannel.component';
import { LineComponent } from '../line/line.component';
import { PencilComponent } from '../pencil/pencil.component';
import { MatSliderModule, MatFormFieldModule, MatOptionModule, MatSelectModule, MatInputModule } from '@angular/material';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToolSelectorService } from 'src/app/services/tools/tool-selector.service';
import { Tools } from 'src/app/enums/tools';
import { HotkeysService } from 'src/app/services/events/shortcuts/hotkeys.service';
import { LineService } from 'src/app/services/index/drawable/line/line.service';
import { DrawablePropertiesService } from 'src/app/services/index/drawable/properties/drawable-properties.service';
import { PencilService } from 'src/app/services/index/drawable/pencil/pencil.service';
import { DrawerService } from 'src/app/services/side-nav-drawer/drawer.service';

describe('OptionPannelComponent', () => {
  let component: OptionPannelComponent;
  let fixture: ComponentFixture<OptionPannelComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ 
        // ADD HERE ALL THE OTHER ADDED TOOLS
        OptionPannelComponent, 
        LineComponent,
        PencilComponent
      ],
      providers: [ 
        OptionPannelComponent,
        HotkeysService,
        LineService,
        ToolSelectorService,
        DrawablePropertiesService,
        DrawerService,
        PencilService
      ],
      imports: [
        BrowserAnimationsModule,
        FormsModule, 
        MatSliderModule, 
        MatFormFieldModule, 
        MatOptionModule, 
        MatSelectModule,
        MatInputModule
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
