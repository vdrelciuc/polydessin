import { Component, OnInit } from '@angular/core';
import { Color } from 'src/app/classes/color';
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

  constructor(private colorSelectorService: ColorSelectorService) { }

  ngOnInit() {
    this.colorSelectorService.primaryColor.subscribe((color: Color) => {
      this.primaryColor = color;
    });
    this.colorSelectorService.secondaryColor.subscribe((color: Color) => {
      this.secondaryColor = color;
    });
    this.colorSelectorService.recentColorsObservable.subscribe((colors: Color[]) => {
      this.recentColors = colors;
    });
  }

}
