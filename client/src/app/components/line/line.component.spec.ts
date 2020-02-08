import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import * as CONSTANT from 'src/app/classes/constants';

import { LineComponent } from './line.component';
import { DrawablePropertiesService } from 'src/app/services/index/drawable/properties/drawable-properties.service';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule, MatSliderModule, MatOptionModule, MatSelectModule, MatInputModule } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LineService } from 'src/app/services/index/drawable/line/line.service';
import { HotkeysService } from 'src/app/services/events/shortcuts/hotkeys.service';
import { ToolSelectorService } from 'src/app/services/tools/tool-selector.service';

describe('LineComponent', () => {
  let component: LineComponent;
  let fixture: ComponentFixture<LineComponent>;
  let properties: DrawablePropertiesService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LineComponent ],
      providers: [
        HotkeysService,
        LineService,
        ToolSelectorService,
        DrawablePropertiesService
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

    fixture = TestBed.createComponent(LineComponent);
    component = fixture.componentInstance;
    component.ngOnInit();
    properties = TestBed.get<DrawablePropertiesService>(DrawablePropertiesService);
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should setup shortcuts', () => {
    component.setupShortcuts();
    let spy = spyOn(TestBed.get<LineService>(LineService), 'removeLastPoint');
    document.dispatchEvent(new KeyboardEvent('backspace', {}));
    document.dispatchEvent(new Event('keydown.backspace'));
    expect(spy).toHaveBeenCalled();
  });

  it('should default junction be none', () => {
    component.onDotSelected();
    expect(properties.junction.value).toBe(false);
  });

  it('should change junction type to dot', () => {
    component.jointType = 'Points';
    component.onDotSelected();
    expect(properties.junction.value).toBe(true);
  });

  it('should not change junction if different than expected', () => {
    component.jointType = 'BLA';
    component.onDotSelected();
    expect(properties.junction.value).toBe(false);
  });
});
