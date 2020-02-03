import { Component, OnInit} from '@angular/core';
import { ColorManipService } from 'src/app/services/colorManip/colorManip.service';
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
  colorHexRegex = /^[0-9A-F]{6}$/i;

  colorPalette = colorPalette;
  showPalette = false;

  constructor(
    public createNewService: CreateNewService,
    public colorManipService: ColorManipService) { }

  ngOnInit() {
    this.createNewService.backgroundColor = [0xff, 0xff, 0xff];
    this.createNewService.canvasSize = [0, 0];
  }

  setBackgroundColor(color: string) {
    if (this.colorHexRegex.test(color)) {
      this.createNewService.backgroundColor = this.colorManipService.hexStringToColor(color);
    }
  }

  getBackgroundColor() {
    return this.colorManipService.colorToHexString(this.createNewService.backgroundColor);
  }

  toggleShowPalette() {
    this.showPalette = !this.showPalette;
  }
}
