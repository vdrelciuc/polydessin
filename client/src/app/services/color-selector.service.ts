import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Color } from '../classes/color';
import * as CONSTANT from '../classes/constants';

@Injectable({
  providedIn: 'root'
})
export class ColorSelectorService {

  primaryColor: BehaviorSubject<Color>;
  secondaryColor: BehaviorSubject<Color>;
  recentColorsObservable: BehaviorSubject<Color[]>;

  private recentColors: Color[];
  private primaryTransparency: number;
  private secondaryTransparency: number;

  constructor() {
    this.primaryColor = new BehaviorSubject<Color>(new Color(CONSTANT.DEFAULT_PRIMARY_COLOR));
    this.secondaryColor = new BehaviorSubject<Color>(new Color(CONSTANT.DEFAULT_SECONDARY_COLOR));
    this.recentColors = [];
    this.recentColorsObservable = new BehaviorSubject<Color[]>(this.recentColors);
    this.primaryTransparency = CONSTANT.DEFAULT_TRANSPARENCY;
    this.secondaryTransparency = CONSTANT.DEFAULT_TRANSPARENCY;
    this.initializeDefaultRecentColors();
  }

  private initializeDefaultRecentColors(): void {
    this.addRecentColor(new Color('#FF0000')); // red
    this.addRecentColor(new Color('#FFFF00')); // yellow
    this.addRecentColor(new Color('#008000')); // green
    this.addRecentColor(new Color('#00FF00')); // lime
    this.addRecentColor(new Color('#0000FF')); // blue
    this.addRecentColor(new Color('#00FFFF')); // aqua
    this.addRecentColor(new Color('#800080')); // purple
    this.addRecentColor(new Color('#FF00FF')); // fuschia
    this.addRecentColor(new Color('#000000')); // black
    this.addRecentColor(new Color('#FFFFFF')); // white
  }

  addRecentColor(color: Color): void {
    if (this.recentColors.length === CONSTANT.MAX_RECENT_COLORS) {
      this.recentColors.shift();
    }
    this.recentColors.push(color);
    this.recentColorsObservable.next(this.recentColors);
  }
}
