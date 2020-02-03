import { Component, OnInit } from '@angular/core';
import { Color } from 'src/app/classes/color';
import * as CONSTANTS from 'src/app/classes/constants';
import { ColorSelectorService } from 'src/app/services/color-selector.service';

@Component({
  selector: 'app-color-panel',
  templateUrl: './color-panel.component.html',
  styleUrls: ['./color-panel.component.scss']
})
export class ColorPanelComponent implements OnInit {

  primaryColor: Color;
  secondaryColor: Color;
  recentColors: Color[];
  primaryTransparency: number;
  secondaryTransparency: number;

  constructor(private colorSelectorService: ColorSelectorService) { }

  ngOnInit(): void {
    this.colorSelectorService.primaryColor.subscribe((color: Color) => {
      this.primaryColor = color;
    });
    this.colorSelectorService.secondaryColor.subscribe((color: Color) => {
      this.secondaryColor = color;
    });
    this.colorSelectorService.recentColorsObservable.subscribe((colors: Color[]) => {
      this.recentColors = colors;
    });
    this.colorSelectorService.primaryTransparency.subscribe((transparency: number) => {
      this.primaryTransparency = transparency;
    });
    this.colorSelectorService.secondaryTransparency.subscribe((transparency: number) => {
      this.secondaryTransparency = transparency;
    });
  }

  onColorInversion(): void {
    this.colorSelectorService.swapColors(this.primaryColor, this.secondaryColor);
  }

  onTransparencyChange(isPrimaryTransparency: boolean): void {
    if (isPrimaryTransparency) {
      if (this.primaryTransparency >= CONSTANTS.MIN_TRANSPARENCY &&
        this.primaryTransparency <= CONSTANTS.MAX_TRANSPARENCY) {
          this.colorSelectorService.primaryTransparency.next(this.primaryTransparency);
        }
    } else {
      if (this.secondaryTransparency >= CONSTANTS.MIN_TRANSPARENCY &&
        this.secondaryTransparency <= CONSTANTS.MAX_TRANSPARENCY) {
          this.colorSelectorService.secondaryTransparency.next(this.secondaryTransparency);
        }
    }
  }

}
