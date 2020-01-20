import { Component, OnInit } from '@angular/core';
import { colorPalette } from './colors';

enum Color {
  R = 0,
  G = 1,
  B = 2,
}

const maxRGB = 0xFF;
const minRGB = 0x00;

@Component({
  selector: 'app-create-new',
  templateUrl: './create-new.component.html',
  styleUrls: ['./create-new.component.scss']
})
export class CreateNewComponent implements OnInit {
  static readonly Color: Color;
  colorPalette = colorPalette;
  showPalette = false;
  backgroundColor: number[];
  canvasSize: number[];

  private numberToHexString(num: number) {
    if (num < 16) { return `0${num.toString(16)}`} else {return num.toString(16)}
  }
//TODO : replace 99999 by workspace size
  getcanvasSize(axis: number) {
    return (this.canvasSize[axis] || 99999);
  }
  setCanvasSize(axis: number, num: number) {
    if (num > 0) {
      this.canvasSize[axis] = num;
    }
  }

  getBackgroundColor() {
    return `#${this.numberToHexString(this.backgroundColor[Color.R])}${this.numberToHexString(this.backgroundColor[Color.G])}${this.numberToHexString(this.backgroundColor[Color.B])}`;
  }

  changeColor(color: number, num: number) {
    if (num && minRGB <= num && num <= maxRGB) {
      this.backgroundColor[color] = parseInt(`${num}`);
    }
  }

  changeColorHex(color: string){
    if (color.length === 6){
      const r = parseInt(`0x${color.substr(0, 2)}`);
      const g = parseInt(`0x${color.substr(2, 2)}`);
      const b = parseInt(`0x${color.substr(4, 2)}`);

      if (!isNaN(r) && !isNaN(g) && !isNaN(b)) {
        this.backgroundColor[Color.R] = r;
        this.backgroundColor[Color.G] = g;
        this.backgroundColor[Color.B] = b;
      }
      this.showPalette = false;
    }
  }

  mainMenu(){
    //TODO
  }

  createNewSheet(){
    //TODO
  }

  constructor() { }

  ngOnInit() {
    this.backgroundColor = [maxRGB, maxRGB, maxRGB];
    this.canvasSize = [0, 0];
  }

}
