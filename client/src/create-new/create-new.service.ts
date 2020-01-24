import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CreateNewService {

  constructor() { }

  readonly maxRGB = 0xFF;
  readonly minRGB = 0x00;

  numberToHexString(num: number) {
    if (num < 0 ) {
      num = 0;
    }
    num = Math.floor(num);
    if (num < 16) { return `0${num.toString(16)}`} else {
      return num.toString(16)}
  }

  colorToHexString(array: number[]) {
    let hex = '';
    for (let i = 0; i < 3; i++) {
      hex = hex + (this.numberToHexString(array[i]));
    }
    return hex;
  }

  hexStringToColor(hexString: string) {
    if (hexString[0] === '#') {
      hexString = hexString.substr(1);
    }
    const color: number[] = [0, 0, 0];
    for (let i = 0; i < 3; i++) {
      color[i] = parseInt(`0x${hexString.substr(2 * i, 2)}`, 16);
    }
    return color;
  }

}
