import { Component, OnInit} from '@angular/core';
import { Color } from 'src/app/classes/color';
import { CreateNewService } from 'src/app/services/create-new/create-new.service';
import { colorPalette } from './colors';

@Component({
  selector: 'app-create-new',
  templateUrl: './create-new.component.html',
  styleUrls: ['./create-new.component.scss']
})

export class CreateNewComponent implements OnInit {
  /* hex color verif
  ^          -> match beginning
  [0-9A-F]   -> any integer from 0 to 9 and any letter from A to F
  {6}        -> the previous group appears exactly 6 times
  $          -> match end
  i          -> ignore case
  */

  colorPalette = colorPalette;
  showPalette = false;

  constructor(public createNewService: CreateNewService) { }

  ngOnInit() {
    this.createNewService.backgroundColor = new Color('FFFFFF');
    this.createNewService.canvasSize = [0, 0];
  }

  getBackgroundColor(): string {
    return this.createNewService.backgroundColor.getHex();
  }

  setBackgroundColor(colorType: number, value: number): void {
    const color: number[] = this.createNewService.backgroundColor.getRGB();
    color[colorType] = Math.floor(value);
    this.createNewService.backgroundColor.setRGB(color);
  }

  toggleShowPalette(): void {
    this.showPalette = !this.showPalette;
  }
}
