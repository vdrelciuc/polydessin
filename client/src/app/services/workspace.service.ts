import { Injectable } from '@angular/core';
import { Color } from '../classes/color';

@Injectable({
  providedIn: 'root'
})
export class WorkspaceService {

  backgroundColor: Color;

  constructor() {
    this.backgroundColor = new Color('#808080');
  }

  checkIfSameBackgroundColor(color: Color): boolean {
    return color.getHex() === this.backgroundColor.getHex();
  }
}
