import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ColorType } from 'src/app/enums/color-types';
import { Color } from '../classes/color';
import * as CONSTANT from '../classes/constants';

@Injectable({
  providedIn: 'root'
})
export class ColorSelectorService {

  primaryColor: BehaviorSubject<Color>;
  secondaryColor: BehaviorSubject<Color>;
  backgroundColor: BehaviorSubject<Color>;
  recentColors: BehaviorSubject<Color[]>;
  primaryTransparency: BehaviorSubject<number>;
  secondaryTransparency: BehaviorSubject<number>;
  colorToChange: ColorType;

  constructor() {
    this.primaryColor = new BehaviorSubject<Color>(new Color(CONSTANT.DEFAULT_PRIMARY_COLOR));
    this.secondaryColor = new BehaviorSubject<Color>(new Color(CONSTANT.DEFAULT_SECONDARY_COLOR));
    this.backgroundColor = new BehaviorSubject<Color>(new Color(CONSTANT.DEFAULT_SECONDARY_COLOR));
    this.recentColors = new BehaviorSubject<Color[]>(this.initializeDefaultColors());
    this.primaryTransparency = new BehaviorSubject<number>(CONSTANT.DEFAULT_TRANSPARENCY);
    this.secondaryTransparency = new BehaviorSubject<number>(CONSTANT.DEFAULT_TRANSPARENCY);
    this.colorToChange = ColorType.Primary;
  }

  private initializeDefaultColors(): Color[] {
    const colors = [];
    colors.push(new Color('#FF0000')); // red
    colors.push(new Color('#FFFF00')); // yellow
    colors.push(new Color('#008000')); // green
    colors.push(new Color('#00FF00')); // lime
    colors.push(new Color('#0000FF')); // blue
    colors.push(new Color('#00FFFF')); // aqua
    colors.push(new Color('#800080')); // purple
    colors.push(new Color('#FF00FF')); // fuschia
    colors.push(new Color('#000000')); // black
    colors.push(new Color('#FFFFFF')); // white
    return colors;
  }

  addRecentColor(color: Color): void {
    const colors = this.recentColors.getValue();
    if (colors.length === CONSTANT.MAX_RECENT_COLORS) {
      colors.shift();
    }
    colors.push(color);
    this.recentColors.next(colors);
  }

  swapColors(currentPrimary: Color, currentSecondary: Color): void {
    this.primaryColor.next(currentSecondary);
    this.secondaryColor.next(currentPrimary);
  }

  updateColor(newColor: Color): void {
    switch (this.colorToChange) {
      case ColorType.Primary: {
        this.primaryColor.next(newColor);
        break;
      }
      case ColorType.Secondary: {
        this.secondaryColor.next(newColor);
        break;
      }
      default: {
        this.backgroundColor.next(newColor);
      }
    }
  }
}
