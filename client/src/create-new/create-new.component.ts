import { Component, OnInit } from '@angular/core';
import { CreateNewService } from 'src/app/services/create-new.service';
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
  backgroundColor: number[];

  canvasSize: number[];

  constructor(public createNewService: CreateNewService) { }

  ngOnInit() {
    this.backgroundColor = [0xff, 0xff, 0xff];
    this.canvasSize = [0, 0];
  }

// TODO : replace 99999 by workspace size
  getcanvasSize(axis: number): number {
    return (this.canvasSize[axis] || 99999);
  }
  setCanvasSize(axis: number, size: number) {
    if (size > 0) {
      this.canvasSize[axis] = size;
    }
  }

  setBackgroundColor(color: string) {
    if (this.colorHexRegex.test(color)) {
      this.backgroundColor = this.createNewService.hexStringToColor(color);
    }
  }

  getBackgroundColor() {
    return this.createNewService.colorToHexString(this.backgroundColor);
  }

  toggleShowPalette() {
    this.showPalette = !this.showPalette;
  }
  mainMenu() {
    // TODO
  }

  createNewSheet() {
    // TODO
  }

}
