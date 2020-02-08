import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormsModule } from '@angular/forms';
import { MatDialog, MatSliderModule } from '@angular/material';
import { BehaviorSubject } from 'rxjs';
import { Color } from 'src/app/classes/color';
import * as CONSTANTS from 'src/app/classes/constants';
import { ColorType } from 'src/app/enums/color-types';
import { ColorSelectorService } from 'src/app/services/color-selector.service';
import { ColorPanelComponent } from './color-panel.component';

describe('ColorPanelComponent', () => {
  let component: ColorPanelComponent;
  let fixture: ComponentFixture<ColorPanelComponent>;
  let service: ColorSelectorService;
  const mockedColor = new Color('#000000');

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ColorPanelComponent ],
      providers: [
        {
          provide: MatDialog,
          useValue: {
            open: () => true,
          },
        },
        {
          provide: ColorSelectorService,
          useValue: {
            primaryColor: new BehaviorSubject<Color>(new Color('#FFFFFF')),
            secondaryColor: new BehaviorSubject<Color>(mockedColor),
            recentColors: new BehaviorSubject<Color[]>([new Color('#FFFFFF'), new Color('#000000')]),
            primaryTransparency: new BehaviorSubject<number>(1),
            secondaryTransparency: new BehaviorSubject<number>(1)
          },
        },
      ],
      imports: [
        FormsModule,
        MatSliderModule,
      ]
    })
    .compileComponents();
    fixture = TestBed.createComponent(ColorPanelComponent);
    component = fixture.componentInstance;
    service =  TestBed.get<ColorSelectorService>(ColorSelectorService);
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('#onTransparencyChange should change transpary with primary and valid transparency', () => {
    component.primaryTransparency = CONSTANTS.MIN_TRANSPARENCY;
    component.onTransparencyChange(true);
    component.primaryTransparency = CONSTANTS.MIN_TRANSPARENCY + 0.01;
    component.onTransparencyChange(true);
    expect(service.primaryTransparency.value).toEqual(CONSTANTS.MIN_TRANSPARENCY + 0.01);
  });

  it('#onTransparencyChange should change transpary with primary and invalid transparency', () => {
    component.primaryTransparency = CONSTANTS.MIN_TRANSPARENCY;
    component.onTransparencyChange(true);
    component.primaryTransparency = CONSTANTS.MIN_TRANSPARENCY - 1;
    component.onTransparencyChange(true);
    expect(service.primaryTransparency.value).toEqual(CONSTANTS.MIN_TRANSPARENCY);
  });

  it('#onTransparencyChange should change transpary with secondary and valid transparency', () => {
    component.secondaryTransparency = CONSTANTS.MAX_TRANSPARENCY;
    component.onTransparencyChange(false);
    component.secondaryTransparency = CONSTANTS.MIN_TRANSPARENCY + 0.01;
    component.onTransparencyChange(false);
    expect(service.secondaryTransparency.value).toEqual(CONSTANTS.MIN_TRANSPARENCY + 0.01);
  });

  it('#onTransparencyChange should change transpary with secondary and invalid transparency', () => {
    component.secondaryTransparency = CONSTANTS.MAX_TRANSPARENCY;
    component.onTransparencyChange(false);
    component.primaryTransparency = CONSTANTS.MAX_TRANSPARENCY + 1;
    component.onTransparencyChange(false);
    expect(service.secondaryTransparency.value).toEqual(CONSTANTS.MAX_TRANSPARENCY);
  });

  it('#onLeftClick should change selected color', () => {
    component.onLeftClick(new Color('#000001'));
    component.onLeftClick(mockedColor);
    expect(service.primaryColor.value.getHex()).toBe(mockedColor.getHex());
  });

  it('#onRightClick should change selected color', () => {
    component.onRightClick(new Color('#000001'));
    component.onRightClick(mockedColor);
    expect(service.secondaryColor.value.getHex()).toBe(mockedColor.getHex());
  });

  it('#onPrimaryColorChange should ', () => {
    component.onPrimaryColorChange();
    expect(service.colorToChange).toEqual(ColorType.Primary);
  });

  it('#onSecondaryColorChange should ', () => {
    component.onSecondaryColorChange();
    expect(service.colorToChange).toEqual(ColorType.Secondary);
  });

  it('#onBackgroundChange should ', () => {
    component.onBackgroundChange();
    expect(service.colorToChange).toEqual(ColorType.Background);
  });

  it('#onColorInversion should invert primary and secondary colors', () => {
    service.primaryColor.next(mockedColor);
    const mockedColor2 = new Color('#FFFFFF');
    service.secondaryColor.next(mockedColor2);
    component.onColorInversion();
    expect(service.primaryColor.value.getHex()).toEqual(mockedColor2.getHex());
    expect(service.secondaryColor.value.getHex()).toEqual(mockedColor.getHex());
  });
});
