import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import * as CONSTANT from 'src/app/classes/constants';

import { FormsModule } from '@angular/forms';
import { MatFormFieldModule, MatInputModule, MatOptionModule, MatSelectModule, MatSliderModule } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HotkeysService } from 'src/app/services/events/shortcuts/hotkeys.service';
import { LineService } from 'src/app/services/index/drawable/line/line.service';
import { DrawablePropertiesService } from 'src/app/services/index/drawable/properties/drawable-properties.service';
import { ToolSelectorService } from 'src/app/services/tools/tool-selector.service';
import { LineComponent } from './line.component';

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
    // component.service.addPointToLine(1,1);
    // component.service.addPointToLine(2,2);
    component.setupShortcuts();
    const spy = spyOn(TestBed.get<LineService>(LineService), 'removeLastPoint');
    document.dispatchEvent(new KeyboardEvent('backspace', {}));
    document.dispatchEvent(new Event('keydown.backspace'));
    expect(spy).toHaveBeenCalled();
  });

  it('should change thickness value to max', () => {
    component.service.thickness = CONSTANT.THICKNESS_MAXIMUM + 1;
    component.onThicknessChange();
    expect(properties.thickness.value).toBe(CONSTANT.THICKNESS_MAXIMUM);
  });

  it('should change thickness value to min', () => {
    component.service.thickness = CONSTANT.THICKNESS_MINIMUM - 1;
    component.onThicknessChange();
    expect(properties.thickness.value).toBe(CONSTANT.THICKNESS_MINIMUM);
  });

  it('should change thickness value to provided value', () => {
    component.service.thickness = CONSTANT.THICKNESS_MINIMUM + 1;
    component.onThicknessChange();
    expect(properties.thickness.value).toBe(CONSTANT.THICKNESS_MINIMUM + 1);
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

  it('should change diameter value to max', () => {
    component.service.dotDiameter = CONSTANT.DIAMETER_MAXIMUM + 1;
    component.onDiameterChange();
    expect(properties.dotDiameter.value).toBe(CONSTANT.DIAMETER_MAXIMUM);
  });

  it('should change diameter value to min', () => {
    component.service.dotDiameter = CONSTANT.DIAMETER_MINIMUM - 1;
    component.onDiameterChange();
    expect(properties.dotDiameter.value).toBe(CONSTANT.DIAMETER_MINIMUM);
  });

  it('should change diameter value to provided value', () => {
    component.service.dotDiameter = CONSTANT.DIAMETER_MINIMUM + 1;
    component.onDiameterChange();
    expect(properties.dotDiameter.value).toBe(CONSTANT.DIAMETER_MINIMUM + 1);
  });
});
