import { TestBed } from '@angular/core/testing';

import { Color } from '../classes/color';
import { ColorType } from '../enums/color-types';
import { ColorSelectorService } from './color-selector.service';

describe('ColorSelectorService', () => {

  let service: ColorSelectorService;
  const colors = ['#ABCDEF', '#ABCDE1', '#ABCDE2', '#ABCDE3'];

  beforeEach(() => {
    TestBed.configureTestingModule({})
    service = TestBed.get(ColorSelectorService);

  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('#addRecentColor should add to recent color', () => {
    const toAdd = new Color('#ABCDEF');
    service.addRecentColor(toAdd);
    expect(service.recentColors.value[0]).toEqual(toAdd);
  });

  it('#addRecentColor should add to recent color', () => {
    const toAdd = new Color('#ABCDEF');
    service.addRecentColor(toAdd);
    expect(service.recentColors.value[0]).toEqual(toAdd);
  });

  it('#addRecentColor should add to recent color', () => {
    const firstColor = '#FFFFFF';
    const testColors = [firstColor, '#FFFFF1', '#FFFFF2', '#FFFFF3',
      '#FFFFF4', '#FFFFF5', '#FFFFF6', '#FFFFF7', '#FFFFF8', '#FFFFF9', '#FFFBF9'];
    for (const element of testColors) {
      service.addRecentColor(new Color(element));
    }
    const toAdd = new Color('#ABCDEF');
    service.addRecentColor(toAdd);
    let found = false;
    for (const element of service.recentColors.value) {
      if (element.getHex() === firstColor) {
        found = true;
      }
    }
    expect(service['recentColors'].getValue().length).toEqual(10);
    expect(found).not.toBeTruthy();
  });

  it('#swapColors should add to recent color', () => {
    service.swapColors(new Color('#FFFFFF'), new Color('#000000'));
    expect(service['primaryColor'].value.getHex()).toEqual('#000000');
    expect(service['secondaryColor'].value.getHex()).toEqual('#FFFFFF');
  });

  it('#getCurrentlySelectedColor should return color of currently selected', () => {
    service['colorToChange'] = ColorType.Primary;
    service.updateColor(new Color(colors[0]));
    expect(service.getCurrentlySelectedColor().getHex()).toEqual(colors[0]);
    service['colorToChange'] = ColorType.Secondary;
    service.updateColor(new Color(colors[1]));
    expect(service.getCurrentlySelectedColor().getHex()).toEqual(colors[1]);
    service['colorToChange'] = ColorType.Background;
    service.updateColor(new Color(colors[2]));
    expect(service.getCurrentlySelectedColor().getHex()).toEqual(colors[2]);
    service['colorToChange'] = ColorType.Preview;
    service.updateColor(new Color(colors[3]));
    expect(service.getCurrentlySelectedColor().getHex()).toEqual(colors[3]);
  });

  it('#updateColor should update all colors', () => {
    service['colorToChange'] = ColorType.Primary;
    service.updateColor(new Color(colors[0]));
    service['colorToChange'] = ColorType.Secondary;
    service.updateColor(new Color(colors[1]));
    service['colorToChange'] = ColorType.Background;
    service.updateColor(new Color(colors[2]));
    service['colorToChange'] = ColorType.Preview;
    service.updateColor(new Color(colors[3]));
    expect(service['primaryColor'].value.getHex()).toEqual('#ABCDEF');
    expect(service['secondaryColor'].value.getHex()).toEqual('#ABCDE1');
    expect(service['backgroundColor'].value.getHex()).toEqual('#ABCDE2');
    expect(service['temporaryColor'].value.getHex()).toEqual('#ABCDE3');
  });

});
