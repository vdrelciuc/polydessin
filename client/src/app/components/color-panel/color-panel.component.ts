import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Color } from 'src/app/classes/color';
import * as CONSTANTS from 'src/app/classes/constants';
import { ColorPickerComponent } from 'src/app/components/color-picker/color-picker.component';
import { ColorType } from 'src/app/enums/color-types';
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

  constructor(
    private colorSelectorService: ColorSelectorService,
    private dialog: MatDialog
    ) { }

  ngOnInit(): void {
    this.colorSelectorService.primaryColor.subscribe((color: Color) => {
      this.primaryColor = color;
    });
    this.colorSelectorService.secondaryColor.subscribe((color: Color) => {
      this.secondaryColor = color;
    });
    this.colorSelectorService.recentColors.subscribe((colors: Color[]) => {
      this.recentColors = colors;
    });
    this.colorSelectorService.primaryTransparency.subscribe((transparency: number) => {
      this.primaryTransparency = transparency;
    });
    this.colorSelectorService.secondaryTransparency.subscribe((transparency: number) => {
      this.secondaryTransparency = transparency;
    });
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

  onPrimaryColorChange(): void {
    this.colorSelectorService.colorToChange = ColorType.Primary;
    this.launchDialog();
  }

  onSecondaryColorChange(): void {
    this.colorSelectorService.colorToChange = ColorType.Secondary;
    this.launchDialog();
  }

  onBackgroundChange(): void {
    this.colorSelectorService.colorToChange = ColorType.Background;
    this.launchDialog();
  }

  onColorInversion(): void {
    this.colorSelectorService.swapColors(this.primaryColor, this.secondaryColor);
  }

  private launchDialog(): void {
    this.dialog.open(ColorPickerComponent, { disableClose: true });
  }

}
